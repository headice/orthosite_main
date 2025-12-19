from __future__ import annotations

from datetime import date, datetime
import logging
from pathlib import Path
import os
from threading import Lock
from typing import Optional
from uuid import uuid4

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from pydantic import BaseModel, Field, HttpUrl
from yookassa import Configuration, Payment
from yookassa.domain.exceptions import ApiError, UnauthorizedError

# === БАЗОВЫЕ НАСТРОЙКИ И ОКРУЖЕНИЕ ===

BASE_DIR = Path(__file__).resolve().parent
ENV_PATH = BASE_DIR / ".env"
load_dotenv(ENV_PATH)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

logger.info("BACKEND STARTED FROM: %s", BASE_DIR)
logger.info(".env path: %s  exists=%s", ENV_PATH, ENV_PATH.exists())


DEFAULT_ALLOWED_ORIGINS = [
    "https://headice-orthosite-main-3b40.twc1.net",
    "https://go-vector.ru",
]


def _parse_allowed_origins(raw: Optional[str]) -> list[str]:
    """Возвращает список доменов для CORS из переменной окружения.

    Пример формата: "https://site.ru,https://app.site.ru,http://localhost:3000".
    Если переменная не указана, оставляем открытым доступ ("*"), чтобы не ломать
    локальную разработку. Всегда убираем лишние пробелы и пустые элементы.
    """

    if not raw:
        return DEFAULT_ALLOWED_ORIGINS.copy()

    origins = [origin.strip() for origin in raw.split(",") if origin.strip()]
    for default_origin in DEFAULT_ALLOWED_ORIGINS:
        if default_origin not in origins:
            origins.append(default_origin)
    return origins or DEFAULT_ALLOWED_ORIGINS.copy()


ALLOWED_ORIGINS = _parse_allowed_origins(os.getenv("BACKEND_ALLOWED_ORIGINS"))
logger.info("CORS allowed origins: %s", ALLOWED_ORIGINS)

app = FastAPI(title="Ticket payments")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Если index.html реально нужен — раскомментируй и создай файл.
# FRONT_PAGE = (BASE_DIR / "templates" / "index.html").read_text(encoding="utf-8")


# === МОДЕЛИ ===

class PriceWindow(BaseModel):
    start_month: int
    start_day: int
    end_month: int
    end_day: int
    amount_rub: int
    crosses_year: bool = False


class PriceResponse(BaseModel):
    amount_rub: int = Field(..., description="Цена билета в рублях")
    window: Optional[PriceWindow] = Field(
        None, description="Ценовое окно, по которому рассчитана цена"
    )


class CreatePaymentRequest(BaseModel):
    description: str = Field(..., example="Билет на интенсив")
    return_url: HttpUrl = Field(
        ...,
        example="https://example.com/payment/success",
        description="Куда вернуть клиента после оплаты",
    )


class CreatePaymentResponse(BaseModel):
    payment_id: str
    status: str
    confirmation_url: str
    amount_rub: int
    order_id: str


class PaymentStatusResponse(BaseModel):
    payment_id: str
    status: str
    order_id: Optional[str] = None


_payment_lock = Lock()
_order_to_payment: dict[str, str] = {}
_payment_to_order: dict[str, str] = {}
_payment_statuses: dict[str, str] = {}


def _append_payment_id(return_url: str, order_id: str) -> str:
    separator = "&" if "?" in return_url else "?"
    return f"{return_url}{separator}payment_id={order_id}"


# === ЦЕНОВЫЕ ОКНА ===

RAW_WINDOWS: list[PriceWindow] = [
    PriceWindow(start_month=12, start_day=20, end_month=12, end_day=30, amount_rub=26990),
    PriceWindow(
        start_month=12,
        start_day=31,
        end_month=1,
        end_day=28,
        amount_rub=29990,
        crosses_year=True,
    ),
]
DEFAULT_PRICE_RUB = 25990

_price_cache_date: Optional[date] = None
_price_cache_value: Optional[PriceResponse] = None


def _materialize_window(window: PriceWindow, anchor_year: int) -> tuple[date, date]:
    start = date(anchor_year, window.start_month, window.start_day)
    end_year = (
        anchor_year + 1
        if window.crosses_year and window.end_month < window.start_month
        else anchor_year
    )
    end = date(end_year, window.end_month, window.end_day)
    return start, end


def resolve_price(target_date: Optional[date] = None) -> PriceResponse:
    today = target_date or datetime.utcnow().date()
    for window in RAW_WINDOWS:
        for anchor in (today.year - 1, today.year, today.year + 1):
            start, end = _materialize_window(window, anchor)
            if start <= today <= end:
                return PriceResponse(amount_rub=window.amount_rub, window=window)
    return PriceResponse(amount_rub=DEFAULT_PRICE_RUB, window=None)


def get_cached_price(target_date: Optional[date] = None) -> PriceResponse:
    """Возвращает цену, кэшируя результат на уровне текущей даты.

    Чтобы не дергать расчеты и БД на каждый запрос, держим цену в памяти на
    протяжении суток. Как только дата сменится, кэш будет пересчитан.
    """

    global _price_cache_date, _price_cache_value  # pylint: disable=global-statement

    today = target_date or datetime.utcnow().date()
    if _price_cache_date == today and _price_cache_value:
        return _price_cache_value

    price = resolve_price(today)
    _price_cache_date = today
    _price_cache_value = price
    return price


# === НАСТРОЙКА YOOKASSA ===

def _configure_yookassa() -> None:
    if getattr(_configure_yookassa, "_configured", False):
        return

    # Блокируем повторную конфигурацию при высоких нагрузках
    if not hasattr(_configure_yookassa, "_lock"):
        _configure_yookassa._lock = Lock()  # type: ignore[attr-defined]

    with _configure_yookassa._lock:  # type: ignore[attr-defined]
        if getattr(_configure_yookassa, "_configured", False):
            return

        account_id = os.getenv("YOOKASSA_SHOP_ID")
        secret_key = os.getenv("YOOKASSA_SECRET_KEY")

        logger.info(
            "CONFIG YOOKASSA: SHOP_ID = %s SECRET_KEY_SET = %s",
            account_id,
            bool(secret_key),
        )

        if not account_id or not secret_key:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=(
                    "YOOKASSA_SHOP_ID и YOOKASSA_SECRET_KEY должны быть заданы в "
                    "переменных окружения"
                ),
            )

        Configuration.account_id = account_id
        Configuration.secret_key = secret_key
        _configure_yookassa._configured = True  # type: ignore[attr-defined]


def _extract_confirmation_url(confirmation: object) -> Optional[str]:
    """Безопасно извлекает ссылку на подтверждение из ответа Yookassa."""

    for key in ("confirmation_url", "url"):
        if isinstance(confirmation, dict) and key in confirmation:
            return confirmation[key]
        value = getattr(confirmation, key, None)
        if isinstance(value, str):
            return value
    return None


# === РОУТЫ ===

@app.get("/")
def root():
    return {"status": "ok", "message": "Backend is running"}


@app.get("/health")
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/wake")
def wakeup_ping() -> dict[str, str]:
    """Быстрый lightweight-endpoint для пингов, чтобы не дать сервису уснуть."""

    return {"status": "awake", "ts": datetime.utcnow().isoformat()}


@app.get("/price", response_model=PriceResponse)
def get_price() -> PriceResponse:
    """Возвращает актуальную стоимость билета с учетом календаря."""
    return get_cached_price()


@app.on_event("startup")
def _warm_up_price_cache() -> None:
    """Прогреваем кэш цены, чтобы первый запрос отвечал быстрее."""

    try:
        get_cached_price()
    except Exception as exc:  # pylint: disable=broad-except
        logger.warning("PRICE CACHE WARMUP FAILED: %s", exc)


# Если нужен рутовый HTML — можно сделать так:
# @app.get("/", response_class=HTMLResponse)
# def landing_page() -> HTMLResponse:
#     return HTMLResponse(content=FRONT_PAGE)


@app.post("/payments", response_model=CreatePaymentResponse, status_code=status.HTTP_201_CREATED)
def create_payment(request: CreatePaymentRequest) -> CreatePaymentResponse:
    price = get_cached_price()
    _configure_yookassa()

    amount_str = f"{price.amount_rub:.2f}"
    order_id = uuid4().hex
    return_url = _append_payment_id(str(request.return_url), order_id)

    # ОЧЕНЬ ВАЖНО: vat_code и tax_system_code должны совпадать с тем,
    # что у тебя включено в кабинете ЮKassa.
    #
    # Пример ниже: "Без НДС" + УСН (доходы).
    #
    # Если у тебя в кабинете другие настройки — надо поправить:
    #   - vat_code: 1 — Без НДС, 2 — 0%, 3 — 10%, 4 — 20%, 5 — 10/110, 6 — 20/120
    #   - tax_system_code: 1–6 в зависимости от системы налогообложения.

    receipt = {
        "customer": {
            # здесь лучше подставить реальные данные клиента
            "full_name": request.description[:128],
            "email": "test@example.com",
        },
        "items": [
            {
                "description": request.description[:128],
                "quantity": "1.00",
                "amount": {
                    "value": amount_str,
                    "currency": "RUB",
                },
                "vat_code": 1,  # 1 = Без НДС (проверь с настройками кабинета!)
                "payment_subject": "service",  # услуга
                "payment_mode": "full_prepayment",
            }
        ],
        # если у тебя включено несколько систем налогобложения,
        # ЮKassa может требовать tax_system_code:
        # "tax_system_code": 2,  # пример: УСН (доходы)
    }

    try:
        payment = Payment.create(
            {
                "amount": {"value": amount_str, "currency": "RUB"},
                "capture": True,
                "description": request.description,
                "confirmation": {
                    "type": "redirect",
                    "return_url": return_url,
                },
                "metadata": {"order_id": order_id},
                "receipt": receipt,
            },
            str(uuid4()),
        )

    except UnauthorizedError as exc:
        logger.error("YOOKASSA unauthorized: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=(
                "Yookassa отклонила запрос: проверь YOOKASSA_SHOP_ID и "
                "YOOKASSA_SECRET_KEY в .env"
            ),
        ) from exc

    except ApiError as exc:
        # Это ошибка именно от ЮKassa → печатаем подробности в лог
        logger.error("=== YOOKASSA API ERROR ===")
        logger.error("Type: %s", type(exc))
        logger.error("Message: %s", exc)
        # У разных версий SDK поля могут отличаться, поэтому аккуратно:
        for attr in ("code", "description", "params", "errors"):
            if hasattr(exc, attr):
                logger.error("%s = %s", attr, getattr(exc, attr))
        logger.error("=== END YOOKASSA API ERROR ===")

        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Ошибка Yookassa: " + str(exc),
        ) from exc

    except Exception as exc:  # pylint: disable=broad-except
        # Любая другая неожиданная ошибка
        logger.exception("UNEXPECTED ERROR WHILE CREATING PAYMENT")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Неожиданная ошибка при обращении к Yookassa",
        ) from exc

    confirmation_url = _extract_confirmation_url(payment.confirmation)
    if not confirmation_url:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Yookassa не вернула ссылку для подтверждения",
        )

    with _payment_lock:
        _order_to_payment[order_id] = payment.id
        _payment_to_order[payment.id] = order_id
        _payment_statuses[payment.id] = payment.status

    return CreatePaymentResponse(
        payment_id=payment.id,
        status=payment.status,
        confirmation_url=confirmation_url,
        amount_rub=price.amount_rub,
        order_id=order_id,
    )


@app.post("/yookassa/webhook")
async def yookassa_webhook(request: Request) -> dict[str, str]:
    payload = await request.json()
    event = payload.get("event")
    payment = payload.get("object", {})

    logger.info("YOOKASSA WEBHOOK EVENT: %s", event)

    if event == "payment.succeeded":
        payment_id = payment.get("id")
        amount = payment.get("amount", {}).get("value")
        status = payment.get("status")

        logger.info(
            "PAYMENT SUCCEEDED: id=%s status=%s amount=%s",
            payment_id,
            status,
            amount,
        )
        if payment_id:
            with _payment_lock:
                _payment_statuses[payment_id] = status or "succeeded"
    elif event == "payment.canceled":
        payment_id = payment.get("id")
        logger.info("PAYMENT CANCELED: %s", payment_id)
        if payment_id:
            with _payment_lock:
                _payment_statuses[payment_id] = "canceled"

    return {"status": "ok"}


@app.get("/payments/{payment_id}", response_model=PaymentStatusResponse)
def get_payment_status(payment_id: str) -> PaymentStatusResponse:
    _configure_yookassa()

    with _payment_lock:
        resolved_payment_id = _order_to_payment.get(payment_id, payment_id)
        cached_status = _payment_statuses.get(resolved_payment_id)
        order_id = _payment_to_order.get(resolved_payment_id)

    if cached_status in {"succeeded", "canceled"}:
        return PaymentStatusResponse(
            payment_id=resolved_payment_id,
            status=cached_status,
            order_id=order_id,
        )

    try:
        payment = Payment.find_one(resolved_payment_id)
    except UnauthorizedError as exc:
        logger.error("YOOKASSA unauthorized: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=(
                "Yookassa отклонила запрос: проверь YOOKASSA_SHOP_ID и "
                "YOOKASSA_SECRET_KEY в .env"
            ),
        ) from exc
    except ApiError as exc:
        logger.error("=== YOOKASSA API ERROR ===")
        logger.error("Type: %s", type(exc))
        logger.error("Message: %s", exc)
        for attr in ("code", "description", "params", "errors"):
            if hasattr(exc, attr):
                logger.error("%s = %s", attr, getattr(exc, attr))
        logger.error("=== END YOOKASSA API ERROR ===")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Ошибка Yookassa: " + str(exc),
        ) from exc
    except Exception as exc:  # pylint: disable=broad-except
        logger.exception("UNEXPECTED ERROR WHILE FETCHING PAYMENT STATUS")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Неожиданная ошибка при обращении к Yookassa",
        ) from exc

    with _payment_lock:
        _payment_statuses[payment.id] = payment.status
        stored_order_id = _payment_to_order.get(payment.id)

    return PaymentStatusResponse(
        payment_id=payment.id,
        status=payment.status,
        order_id=stored_order_id,
    )
