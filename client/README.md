# Frontend (Create React App)

## Подключение к бэкенду
1. Создайте файл `.env` в директории `client` (рядом с `package.json`).
2. Пропишите адрес бэкенда:
   ```env
   REACT_APP_API_BASE_URL=http://localhost:8000
   ```
3. Перезапустите фронтенд (`npm start`) или пересоберите `npm run build`, чтобы переменная попала в сборку. Без этого модальное окно оплаты покажет ошибку «Бэкенд не настроен».

## Быстрый старт
```bash
cd client
npm install
npm start
```

Приложение откроется на [http://localhost:3000](http://localhost:3000).

## Доступные команды

- `npm start` — запускает приложение в режиме разработки.
- `npm test` — запускает тесты в watch-режиме.
- `npm run build` — собирает production-сборку в папку `build`.
- `npm run eject` — извлекает конфигурацию CRA (необратимо).
