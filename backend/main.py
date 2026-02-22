from __future__ import annotations

from datetime import date, datetime
from email.message import EmailMessage
import logging
import os
from pathlib import Path
import smtplib
from threading import Lock
from typing import Optional, TypedDict
from uuid import uuid4

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
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


DEFAULT_ALLOWED_ORIGINS = [
    "headice-orthosite-main-fbf7.twc1.net",
    "https://go-vector.ru",
]


def _parse_allowed_origins(raw: Optional[str]) -> list[str]:
    """Возвращает список доменов для CORS из переменной окружения.

    Формат: "https://site.ru  ,https://app.site.ru  ,http://localhost:3000".
    Если переменная не указана — используем DEFAULT_ALLOWED_ORIGINS.
    Всегда убираем лишние пробелы и пустые элементы.
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
    email: EmailStr = Field(..., example="user@example.com")
    return_url: HttpUrl = Field(
        ...,
        example="https://example.com/payment/success  ",
        description="Куда вернуть клиента после оплаты",
    )


class CreatePaymentResponse(BaseModel):
    payment_id: str
    status: str
    confirmation_url: str
    amount_rub: int


class PaymentStatusResponse(BaseModel):
    payment_id: str
    status: str


# === ПАМЯТЬ О ПЛАТЕЖАХ ===


class PaymentRecord(TypedDict):
    payment_id: str
    status: str
    description: str
    amount_rub: int
    created_at: str
    customer_email: Optional[str]
    receipt_sent: bool


_payment_registry: dict[str, PaymentRecord] = {}
_payment_registry_lock = Lock()


def _register_payment(
    payment_id: str,
    description: str,
    amount_rub: int,
    status: str,
    customer_email: Optional[str],
) -> None:
    with _payment_registry_lock:
        _payment_registry[payment_id] = {
            "payment_id": payment_id,
            "status": status,
            "description": description,
            "amount_rub": amount_rub,
            "created_at": datetime.utcnow().isoformat(),
            "customer_email": customer_email,
            "receipt_sent": False,
        }


def _update_payment_status(payment_id: Optional[str], status: Optional[str]) -> None:
    if not payment_id or not status:
        return

    with _payment_registry_lock:
        record = _payment_registry.get(payment_id)
        if record:
            record["status"] = status
        else:
            _payment_registry[payment_id] = {
                "payment_id": payment_id,
                "status": status,
                "description": "unknown",
                "amount_rub": 0,
                "created_at": datetime.utcnow().isoformat(),
                "customer_email": None,
                "receipt_sent": False,
            }


def _smtp_configured() -> bool:
    return bool(os.getenv("SMTP_HOST") and os.getenv("SMTP_FROM"))


def _send_receipt_email(
    *,
    to_email: str,
    payment_id: str,
    amount_rub: int,
    description: str,
) -> None:
    host = os.getenv("SMTP_HOST")
    if not host:
        raise RuntimeError("SMTP_HOST is not configured")
    port = int(os.getenv("SMTP_PORT", "587"))
    username = os.getenv("SMTP_USER")
    password = os.getenv("SMTP_PASSWORD")
    sender = os.getenv("SMTP_FROM")
    use_tls = os.getenv("SMTP_USE_TLS", "true").lower() in ("1", "true", "yes")

    if not sender:
        raise RuntimeError("SMTP_FROM is not configured")

    message = EmailMessage()
    message["From"] = sender
    message["To"] = to_email
    message["Subject"] = "Чек по оплате участия"
    message.set_content(
        "\n".join(
            [
                "Спасибо за оплату!",
                f"Описание: {description}",
                f"Сумма: {amount_rub} ₽",
                f"ID платежа: {payment_id}",
                "",
                "Если вы ожидаете кассовый чек от ЮKassa, убедитесь, что",
                "он разрешен в настройках магазина. В тестовом режиме чеки",
                "на почту не отправляются.",
            ]
        )
    )

    with smtplib.SMTP(host, port, timeout=10) as smtp:
        if use_tls:
            smtp.starttls()
        if username and password:
            smtp.login(username, password)
        smtp.send_message(message)


def _should_send_receipt(payment_id: str) -> bool:
    with _payment_registry_lock:
        record = _payment_registry.get(payment_id)
        return bool(record and not record["receipt_sent"])


def _set_receipt_sent(payment_id: str) -> None:
    with _payment_registry_lock:
        record = _payment_registry.get(payment_id)
        if record:
            record["receipt_sent"] = True


# === ЦЕНА (ФИКСИРОВАННАЯ) ===
# Цена всегда 30000 руб.

DEFAULT_PRICE_RUB = 30000

_price_cache_date: Optional[date] = None
_price_cache_value: Optional[PriceResponse] = None


def resolve_price(target_date: Optional[date] = None) -> PriceResponse:
    """Всегда возвращает фиксированную цену."""
    return PriceResponse(amount_rub=DEFAULT_PRICE_RUB, window=None)


def get_cached_price(target_date: Optional[date] = None) -> PriceResponse:
    """Возвращает цену, кэшируя результат на уровне текущей даты."""
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
    """Возвращает актуальную стоимость билета."""
    return get_cached_price()


@app.on_event("startup")
def _warm_up_price_cache() -> None:
    """Прогреваем кэш цены, чтобы первый запрос отвечал быстрее."""
    try:
        get_cached_price()
    except Exception as exc:  # pylint: disable=broad-except
        logger.warning("PRICE CACHE WARMUP FAILED: %s", exc)


@app.post("/payments", response_model=CreatePaymentResponse, status_code=status.HTTP_201_CREATED)
def create_payment(request: CreatePaymentRequest) -> CreatePaymentResponse:
    price = get_cached_price()
    _configure_yookassa()

    amount_str = f"{price.amount_rub:.2f}"

    receipt = {
        "customer": {
            "email": str(request.email),
        },
        "send": True,
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
        # "tax_system_code": 2,  # при необходимости раскомментируй и выставь свой код
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

    _register_payment(
        payment_id=payment.id,
        description=request.description,
        amount_rub=price.amount_rub,
        status=payment.status,
        customer_email=str(request.email),
    )

    return CreatePaymentResponse(
        payment_id=payment.id,
        status=payment.status,
        confirmation_url=confirmation_url,
        amount_rub=price.amount_rub,
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
        status_val = payment.get("status")

        logger.info(
            "PAYMENT SUCCEEDED: id=%s status=%s amount=%s",
            payment_id,
            status_val,
            amount,
        )
        _update_payment_status(payment_id, status_val)
        if payment_id and _smtp_configured() and _should_send_receipt(payment_id):
            with _payment_registry_lock:
                record = _payment_registry.get(payment_id)
            if record and record["customer_email"]:
                try:
                    _send_receipt_email(
                        to_email=record["customer_email"],
                        payment_id=payment_id,
                        amount_rub=record["amount_rub"],
                        description=record["description"],
                    )
                    _set_receipt_sent(payment_id)
                    logger.info("RECEIPT EMAIL SENT: %s", payment_id)
                except Exception as exc:  # pylint: disable=broad-except
                    logger.error("RECEIPT EMAIL FAILED: %s", exc)
    elif event == "payment.canceled":
        payment_id = payment.get("id")
        logger.info("PAYMENT CANCELED: %s", payment_id)
        _update_payment_status(payment_id, payment.get("status", "canceled"))

    return {"status": "ok"}


@app.get("/payments/{payment_id}", response_model=PaymentStatusResponse)
def get_payment_status(payment_id: str) -> PaymentStatusResponse:
    _configure_yookassa()

    with _payment_registry_lock:
        cached_record = _payment_registry.get(payment_id)
    if cached_record and cached_record["status"] in {"succeeded", "canceled"}:
        return PaymentStatusResponse(
            payment_id=payment_id,
            status=cached_record["status"],
        )

    try:
        payment = Payment.find_one(payment_id)
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

    _update_payment_status(payment.id, payment.status)
    return PaymentStatusResponse(payment_id=payment.id, status=payment.status)