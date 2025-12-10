from datetime import date, datetime
import os
from typing import Optional
from uuid import uuid4

from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, Field, HttpUrl
from yookassa import Configuration, Payment

app = FastAPI(title="Ticket payments")


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
        ..., example="https://example.com/payment/success", description="Куда вернуть клиента после оплаты"
    )


class CreatePaymentResponse(BaseModel):
    payment_id: str
    status: str
    confirmation_url: str
    amount_rub: int


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
    end_year = anchor_year + 1 if window.crosses_year and window.end_month < window.start_month else anchor_year
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


def _configure_yookassa() -> None:
    account_id = os.getenv("YOOKASSA_SHOP_ID")
    secret_key = os.getenv("YOOKASSA_SECRET_KEY")
    if not account_id or not secret_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="YOOKASSA_SHOP_ID и YOOKASSA_SECRET_KEY должны быть заданы в переменных окружения",
        )
    Configuration.account_id = account_id
    Configuration.secret_key = secret_key


@app.get("/price", response_model=PriceResponse)
def get_price() -> PriceResponse:
    """Возвращает актуальную стоимость билета с учетом календаря."""
    return resolve_price()


@app.post("/payments", response_model=CreatePaymentResponse, status_code=status.HTTP_201_CREATED)
def create_payment(request: CreatePaymentRequest) -> CreatePaymentResponse:
    price = resolve_price()
    _configure_yookassa()

    try:
        payment = Payment.create(
            {
                "amount": {"value": f"{price.amount_rub:.2f}", "currency": "RUB"},
                "capture": True,
                "description": request.description,
                "confirmation": {"type": "redirect", "return_url": str(request.return_url)},
            },
            uuid4(),
        )
    except Exception as exc:  # yookassa SDK уже кидает осмысленные ошибки
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Ошибка Yookassa: {exc}",
        ) from exc

    confirmation_url = payment.confirmation.get("confirmation_url") or payment.confirmation.get("url")
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


@app.get("/health")
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}
