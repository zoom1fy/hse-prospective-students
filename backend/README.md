# HSE Prospective Students

FastAPI + SQLAlchemy Async + PostgreSQL.

## Run

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Set database variables in `.env` before starting the application.

Current authentication is temporary: protected endpoints expect `X-User-Id` header. Replace `app/api/deps.py` with JWT authentication later.
