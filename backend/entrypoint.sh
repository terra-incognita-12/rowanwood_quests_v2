#!/bin/sh

# set -e

echo "*ENTRYPOINT*: Waiting for postgres connection..."

while ! nc -z db 5432; do
    sleep 0.5
done

echo "*ENTRYPOINT*: Postgres connected!"

alembic upgrade head

exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload