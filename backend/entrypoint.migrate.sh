#!/bin/sh
set -e
alembic upgrade head
PGPASSWORD=postgres psql -U postgres -h db -p 5432 -d hse_prospective_students -f /app/db_scripts/seed.sql || echo "Seed failed or already applied"