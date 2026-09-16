# HSE Prospective Students

FastAPI + SQLAlchemy Async + PostgreSQL.

## Run

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Set database and JWT variables in `.env` before starting the application (see `.env.example`).

## Database

Apply migrations and seed the demo data:

```bash
alembic upgrade head
psql -U postgres -d hse_prospective_students -f db_scripts/seed.sql
```

Demo users' password: `password123`. Seed scripts live in `db_scripts/`.

## Authentication

JWT Bearer (OAuth2 password flow). Register via `POST /api/auth/register`, get a token via `POST /api/auth/login` (`username` = email). Protected endpoints expect `Authorization: Bearer <token>`. Passwords are stored as argon2 hashes (`app/core/security.py`).
