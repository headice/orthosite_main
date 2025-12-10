# Backend для оплаты билетов через ЮKassa

Легкий backend на FastAPI c готовой интеграцией ЮKassa и календарной логикой цен (из примера: 20–30 декабря — 26 990₽, 31 декабря–28 января — 29 990₽, иначе — 25 990₽).

## Что уже готово
- Эндпоинт `/price` — возвращает актуальную цену с учетом дат.
- Эндпоинт `/payments` — создает платеж в ЮKassa и отдает ссылку для редиректа клиента.
- Эндпоинт `/health` — проверка живости сервиса.

## Настройка окружения
1. Установите зависимости:
   ```bash
   cd server
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```
2. Создайте файл `.env` (или задайте переменные окружения) с вашими ключами ЮKassa:
   ```bash
   export YOOKASSA_SHOP_ID="ваш shopId"
   export YOOKASSA_SECRET_KEY="ваш secretKey"
   ```

## Запуск
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Примеры запросов
- Проверить цену:
  ```bash
  curl http://localhost:8000/price
  ```
- Создать платеж:
  ```bash
  curl -X POST http://localhost:8000/payments \
       -H "Content-Type: application/json" \
       -d '{"description": "Билет на интенсив", "return_url": "https://example.com/payment/success"}'
  ```

В ответе будет `confirmation_url`, на который нужно отправить пользователя для завершения оплаты. 
