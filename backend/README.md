# Backend: FastAPI + YooKassa

Инструкция по локальному запуску и проверке эндпоинтов бэкенда.

## Требования
- Python 3.10+
- Virtualenv (рекомендуется, но не обязательно)

## Подготовка окружения
1. Перейдите в директорию `backend`:
   ```bash
   cd backend
   ```
2. Создайте и активируйте виртуальное окружение (опционально, но желательно):
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   ```
3. Установите зависимости:
   ```bash
   pip install -r requirements.txt
   ```

## Переменные окружения
Бэкенду нужны две переменные:
- `YOOKASSA_SHOP_ID`
- `YOOKASSA_SECRET_KEY`

Их можно задать:
- через файл `.env` в директории `backend` (пример):
  ```env
  YOOKASSA_SHOP_ID=your_shop_id
  YOOKASSA_SECRET_KEY=your_secret_key
  ```
- или через переменные окружения текущей сессии:
  ```bash
  export YOOKASSA_SHOP_ID=your_shop_id
  export YOOKASSA_SECRET_KEY=your_secret_key
  ```

## Запуск сервера
1. Находясь в `backend`, запустите uvicorn:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```
2. После старта будут доступны эндпоинты:
   - `GET /` — проверка, что сервис запущен
   - `GET /health` — healthcheck
   - `GET /price` — текущая цена билета
   - `POST /payments` — создание платежа в YooKassa

## Быстрая проверка
В отдельном терминале (с активированным окружением и заданными переменными):
```bash
curl http://127.0.0.1:8000/health
```
Должен вернуться JSON: `{"status": "ok"}`.

Для проверки цены:
```bash
curl http://127.0.0.1:8000/price
```

Для создания платежа (подставьте свой `return_url`):
```bash
curl -X POST http://127.0.0.1:8000/payments \
  -H "Content-Type: application/json" \
  -d '{"description": "Билет на интенсив", "return_url": "https://example.com/payment/success"}'
```
