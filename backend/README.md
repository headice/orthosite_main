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
   Если деплой делается не из Docker, а через сервисы вроде Timeweb Apps, убедитесь,
   что в корне репозитория берётся правильный `requirements.txt` (в корне лежит
   копия с `python-dotenv`, `fastapi`, `uvicorn`, `yookassa`).

## Переменные окружения
Бэкенду нужны две обязательные переменные:
- `YOOKASSA_SHOP_ID`
- `YOOKASSA_SECRET_KEY`

И одна необязательная:
- `BACKEND_ALLOWED_ORIGINS` — список доменов через запятую для CORS (например,
  `https://example.com,http://localhost:3000`). Если не указать, разрешены все
  источники (`*`), что удобно для локальной разработки.

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

### Диагностика «invalid_credentials»
Если при создании платежа сервер отвечает 502 с текстом про неверные данные авторизации, 
это означает, что в `.env` указан неверный `YOOKASSA_SECRET_KEY` или `YOOKASSA_SHOP_ID`. 
Убедитесь, что копируете **секретный ключ из кабинета** (а не публичный) и перезапустите сервер после правки `.env`.

## Запуск сервера
1. Находясь в `backend`, запустите uvicorn:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```
2. После старта будут доступны эндпоинты:
   - `GET /` — проверка, что сервис запущен
   - `GET /health` — healthcheck
   - `GET /wake` — lightweight-пинг для поддержания сервиса «в тонусе»
   - `GET /price` — текущая цена билета
   - `POST /payments` — создание платежа в YooKassa

## Деплой в контейнер (например, Timeweb Cloud)
В корне репозитория есть `Dockerfile`, который собирает только бэкенд и открывает 8000 порт.

1. Соберите образ из корня репозитория (контекст по умолчанию `.` уже содержит всё, что нужно бэкенду):
   ```bash
   docker build -t ticket-backend .
   ```
   В контексте сборки лишние файлы (git, `client/`, виртуальные окружения) исключены через `.dockerignore`, поэтому образ получается компактнее и быстрее.

2. Запустите контейнер, пробросив порт 8000 и передав переменные окружения:
   ```bash
   docker run --rm -p 8000:8000 \
     -e YOOKASSA_SHOP_ID=your_shop_id \
     -e YOOKASSA_SECRET_KEY=your_secret_key \
     ticket-backend
   ```

3. В панели Timeweb (или другом хостинге контейнеров) укажите:
   - команду запуска: `uvicorn main:app --host 0.0.0.0 --port 8000`
   - рабочую директорию контейнера: `/app/backend`
   - переменные окружения `YOOKASSA_SHOP_ID`, `YOOKASSA_SECRET_KEY` (и при необходимости `BACKEND_ALLOWED_ORIGINS`).
   Образ автоматически открывает порт 8000 (`EXPOSE 8000`), поэтому после старта сервис будет виден health-чекам.

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

## Интеграция фронтенда
- В клиенте можно указать адрес API через переменную окружения CRA: `REACT_APP_API_BASE_URL=http://localhost:8000`.
- После биллинга бекенд возвращает `confirmation_url` — фронтенд должен перенаправлять пользователя на эту ссылку для оплаты.
