# HSE Prospective Students

Платформа наглядного информирования абитуриентов: каталог университетов, факультетов и программ, личный кабинет с рекомендациями, древо поданных заявок и админ-панель.

## Стек

| Часть | Технологии |
| --- | --- |
| `backend/` | FastAPI, SQLAlchemy 2.0 (async), asyncpg, Pydantic v2, Alembic, JWT (argon2 через pwdlib) |
| `frontend/` | Next.js (App Router), React 19, TypeScript 5, Tailwind CSS 4, bun, framer-motion |
| `nginx/` | reverse-proxy: `/api/` на backend, остальное на frontend |

## Структура

```
backend/    FastAPI: app/api (роутеры), app/crud, app/services, app/models, app/schemas
            alembic/versions — миграции, db_scripts/seed.sql — демо-данные
frontend/   Next.js: src/app (роуты), src/components, src/data (моки), src/lib/api
nginx/      конфиг reverse-proxy
ai_proxy.py AI-прокси для чат-бота (streaming /api/chat)
docs/       ТЗ (website-structure.md), модель БД (db_models.md), анализ аналогов
scripts/    скрипты запуска frontend (dev/prod/docker, .bat и .sh)
docker-compose.yml   db + migrate + backend + ai-proxy + frontend + nginx
```

## Запуск

### Docker (всё вместе: БД, backend, frontend, nginx)

```bash
docker compose build
docker compose up -d
```

- Сайт: `http://localhost`
- API и Swagger: `http://localhost/api` (OpenAPI — `/api/openapi.json`)
- AI-чат: `http://localhost/api/chat` (streaming, через nginx на `ai-proxy`)
- Health: `http://localhost/health`

Сервис `migrate` применяет миграции и seed-данные при первом старте. Демо-пользователи: `password123`.

### Локально (для разработки)

Backend:

```bash
cd backend
python -m pip install -r requirements.txt
cp .env.example .env          # заполнить настройки БД и SECRET_KEY
python -m alembic upgrade head
psql -U postgres -d hse_prospective_students -f db_scripts/seed.sql
python -m uvicorn app.main:app --reload   # http://localhost:8000/docs
```

Frontend:

```bash
cd frontend
bun install
bun run dev                   # http://localhost:3000
```

Пока backend не подключён к страницам, frontend использует моки из `src/data`. Интеграция настраивается через `NEXT_PUBLIC_API_URL` / `API_INTERNAL_URL` (см. `frontend/.env.example`).

## Полезное

- Модель БД — `docs/db_models.md`
- ТЗ и структура страниц — `docs/website-structure.md`
- Прочие скрипты запуска frontend — `scripts/frontend/`