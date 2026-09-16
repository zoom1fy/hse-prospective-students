# AGENTS.md

Общие правила и контекст для работы с этим репозиторием (монорепо).

## Обзор

Платформа помощи абитуриентам: каталог университетов / факультетов / программ обучения, экзамены, заявления, рекомендации и сравнения программ.

## Структура

```
backend/    FastAPI (Python) + async SQLAlchemy 2.0 + PostgreSQL, Alembic-миграции, seed-скрипты в backend/db_scripts/
frontend/   Next.js 16 (App Router) + React 19 + TypeScript 5 + Tailwind CSS 4
nginx/      reverse-proxy конфиг для /health и frontend
docs/       модельная и продуктовая документация
scripts/    вспомогательные скрипты
```

Бэкенд не входит в `docker-compose.yml` (docker-compose поднимает только frontend + nginx).

## Backend

Стек: FastAPI, SQLAlchemy 2.0 async (`AsyncSession`, `Mapped`), asyncpg, PostgreSQL, Pydantic v2 (`from_attributes=True`), Alembic (async `env.py`). Python 3.13+.

### Запуск

```powershell
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

Документация: `http://localhost:8000/docs` (Swagger UI), `/redoc`, `/openapi.json`.

### Конфигурация

- Переменные БД и JWT читаются из `backend/.env` (см. `app/core/config.py`, шаблон — `backend/.env.example`).
- `.env` в git не коммитится (`.gitignore`); коммить только `.env.example`.

### Миграции

- Alembic настроен на async (`alembic/env.py`), миграции — в `alembic/versions/`.
- Команды: `python -m alembic revision --autogenerate -m "..."` и `python -m alembic upgrade head`.
- При изменении моделей — генерируй миграцию и применяй её, не редактируй БД вручную.
- Силд-данные для разработки — `backend/db_scripts/seed.sql` (применяется после `alembic upgrade head`, сбрасывает и заполняет данные; пароль демо-пользователей — `password123`).

### Аутентификация и авторизация

- Схема: JWT Bearer. Логин — `POST /api/auth/login` (OAuth2 password flow, `username` = email, form-data), регистрация — `POST /api/auth/register` (JSON, поле `password`).
- Пароли хранятся только в виде хеша (`users.password_hash`, argon2 через `pwdlib`); в ответах API пароль не возвращается.
- Зависимость `get_current_user` (`app/api/deps.py`) достаёт пользователя из токена; персональные маршруты (`/api/users/me`, statements, recommendations, comparisons) защищены ею и фильтруют данные по `user.id`.
- Настройки: `SECRET_KEY`, `ACCESS_TOKEN_EXPIRE_MINUTES`, `ALGORITHM` в `.env`. `SECRET_KEY` держать в секрете.

### Код: правила

- Роутеры: `app/api/routers/`, подключаются в `app/main.py` с префиксом `/api/<entity>`.
- CRUD-операции — слой `app/crud/`, бизнес-логика — `app/services/`, Pydantic-схемы — `app/schemas/`, безопасность — `app/core/security.py`.
- Новые эндпоинты автоматически попадают в Swagger — статические копии OpenAPI не держим.
- Тестов в репозитории нет, линтер/тайпчекер для backend не настроен.

## Frontend

Стек: Next.js 16.3.5 (App Router), React 19, TypeScript 5, Tailwind CSS 4, framer-motion, lucide-react. Менеджер пакетов — bun.

### Запуск и проверка

```powershell
cd frontend
bun install
bun run dev        # http://localhost:3000
bun run lint       # eslint
bun run typecheck  # next typegen + tsc --noEmit
bun run build      # продакшен-сборка
```

Перед завершением задачи в frontend всегда прогоняй `bun run lint` и `bun run typecheck`.

### Код: правила

- Экранные данные временно берутся из моков в `src/data/`; HTTP-клиент `src/lib/api/client.ts` уже есть, но пока не подключён к страницам.
- Данные, разделяемые сервером и клиентом, — в `src/hooks`/`src/constants` где это применимо.

### Важно: Next.js 16

Фронтенд работает на **Next.js 16 с ломающими изменениями** относительно тренировочных данных. Перед написанием кода для frontend читай актуальные гайды из `node_modules/next/dist/docs/` и правила в `frontend/AGENTS.md` (блок дописывается самим `next dev`, правки в нём не сохраняй в коммиты).

## Общие правила

- Коммиты и документация на русском; сообщения коммитов краткие, по делу.
- Не добавляй комментарии в код без необходимости.
- Перед изменением файла — изучи стили соседних файлов и уже используемые библиотеки.
- Не коммить секреты и `.env`.
- Документацию по моделям БД держи в `docs/db_models.md` и держи её в актуальном состоянии при изменениях схемы.