Простой сайт: Express + SQLite + Vanilla JS

Запускается локально, содержит 1 таблицу `items` и реализует CRUD через REST API и простую веб-страницу.

Требования
- Node.js 18+

Установка
1. Откройте терминал в папке проекта
2. Установите зависимости:
   ```bash
   npm install
   ```

Запуск
```bash
npm start
```
Сервер поднимется на `http://localhost:3000`.

Структура
- `src/server.js` — запуск Express, статика, подключение роутера
- `src/sqlite.js` — инициализация БД SQLite и методы для CRUD
- `src/views/items.controller.js` — контроллер с маршрутами: GET/POST/PUT/DELETE
- `public/` — простая страница с таблицей и действиями

API
- `GET /api/items` — список записей
- `GET /api/items/:id` — получить запись
- `POST /api/items` — создать `{ title, description? }`
- `PUT /api/items/:id` — обновить `{ title, description? }`
- `DELETE /api/items/:id` — удалить

База данных
- SQLite-файл создаётся автоматически в `data/app.db`
- Таблица `items(id, title, description, created_at)`


