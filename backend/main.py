from __future__ import annotations

from datetime import date, datetime
import logging
from pathlib import Path
import os
from typing import Optional
from uuid import uuid4

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, Header, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from pydantic import BaseModel, EmailStr, Field, HttpUrl
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

DEBUG_TOOLS_ENABLED = os.getenv("DEBUG_TOOLS_ENABLED", "false").lower() in {
    "1",
    "true",
    "yes",
}

app = FastAPI(title="Ticket payments")

def _get_allowed_origins() -> list[str]:
    raw = os.getenv("CORS_ALLOWED_ORIGINS", "")
    return [origin.strip() for origin in raw.split(",") if origin.strip()]


ALLOWED_ORIGINS = _get_allowed_origins()

if ALLOWED_ORIGINS:
    logger.info("CORS enabled for origins: %s", ALLOWED_ORIGINS)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["GET", "POST"],
        allow_headers=["Authorization", "Content-Type", "X-API-Key"],
    )
else:
    logger.warning(
        "CORS_ALLOWED_ORIGINS is empty: CORS middleware is not configured and "
        "browser access will be blocked"
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
    customer_email: Optional[EmailStr] = Field(
        None,
        description=("Email плательщика для чека. Необязателен, но должен быть валиден"),
    )


class CreatePaymentResponse(BaseModel):
    payment_id: str
    status: str
    confirmation_url: str
    amount_rub: int


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


# === НАСТРОЙКА YOOKASSA ===

def _configure_yookassa() -> None:
    account_id = os.getenv("YOOKASSA_SHOP_ID")
    secret_key = os.getenv("YOOKASSA_SECRET_KEY")

    logger.info(
        "CONFIG YOOKASSA: SHOP_ID = %s SECRET_KEY_SET = %s", account_id, bool(secret_key)
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


def _require_api_key(x_api_key: str = Header(..., alias="X-API-Key")) -> None:
    expected = os.getenv("PAYMENTS_API_KEY")
    if not expected:
        logger.error("PAYMENTS_API_KEY is not configured")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Платежный API временно недоступен",
        )
    if x_api_key != expected:
        logger.warning("Invalid API key attempt")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неавторизованный запрос",
        )


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


@app.get("/debug-env")
def debug_env():
    if not DEBUG_TOOLS_ENABLED:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
    return {
        "YOOKASSA_SHOP_ID": os.getenv("YOOKASSA_SHOP_ID"),
        "YOOKASSA_SECRET_KEY_SET": bool(os.getenv("YOOKASSA_SECRET_KEY")),
        "BASE_DIR": str(BASE_DIR),
        "ENV_PATH": str(ENV_PATH),
    }


@app.get("/price", response_model=PriceResponse)
def get_price() -> PriceResponse:
    """Возвращает актуальную стоимость билета с учетом календаря."""
    return resolve_price()


# Если нужен рутовый HTML — можно сделать так:
# @app.get("/", response_class=HTMLResponse)
# def landing_page() -> HTMLResponse:
#     return HTMLResponse(content=FRONT_PAGE)


@app.post(
    "/payments", response_model=CreatePaymentResponse, status_code=status.HTTP_201_CREATED
)
def create_payment(
    request: CreatePaymentRequest, _=Depends(_require_api_key)
) -> CreatePaymentResponse:
    price = resolve_price()
    _configure_yookassa()

    amount_str = f"{price.amount_rub:.2f}"

    # ОЧЕНЬ ВАЖНО: vat_code и tax_system_code должны совпадать с тем,
    # что у тебя включено в кабинете ЮKassa.
    #
    # Пример ниже: "Без НДС" + УСН (доходы).
    #
    # Если у тебя в кабинете другие настройки — надо поправить:
    #   - vat_code: 1 — Без НДС, 2 — 0%, 3 — 10%, 4 — 20%, 5 — 10/110, 6 — 20/120
    #   - tax_system_code: 1–6 в зависимости от системы налогообложения.

    customer_data = {"full_name": request.description[:128]}
    if request.customer_email:
        customer_data["email"] = request.customer_email

    receipt = {
        "customer": customer_data,
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
                    "return_url": str(request.return_url),
                },
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

    return CreatePaymentResponse(
        payment_id=payment.id,
        status=payment.status,
        confirmation_url=confirmation_url,
        amount_rub=price.amount_rub,
    )
