#!/bin/sh
set -e

echo "Waiting for database..."
while ! pg_isready -h db -p 5432 -U postgres; do
  sleep 1
done
echo "Database is ready!"

alembic upgrade head
PGPASSWORD=postgres psql -U postgres -h db -p 5432 -d hse_prospective_students -f /app/db_scripts/seed.sql || echo "Seed failed or already applied"