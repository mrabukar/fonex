#!/usr/bin/env bash
# Creates the local PostgreSQL role and database for Fonex.
# Run once on the VPS: sudo bash scripts/setup-fonex-db.sh
set -euo pipefail

DB_NAME="fonex_db"
DB_USER="fonex_app"
DB_PASSWORD_FILE="/var/www/fonex/apps/api/.env"

if [[ ! -f "$DB_PASSWORD_FILE" ]]; then
  echo "Missing $DB_PASSWORD_FILE — create apps/api/.env first."
  exit 1
fi

DB_PASSWORD="$(grep '^DATABASE_URL=' "$DB_PASSWORD_FILE" | sed -n 's#.*://[^:]*:\([^@]*\)@.*#\1#p')"
if [[ -z "$DB_PASSWORD" ]]; then
  echo "Could not read database password from DATABASE_URL in $DB_PASSWORD_FILE"
  exit 1
fi

sudo -u postgres psql -v ON_ERROR_STOP=1 <<SQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${DB_USER}') THEN
    CREATE ROLE ${DB_USER} LOGIN PASSWORD '${DB_PASSWORD}';
  ELSE
    ALTER ROLE ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';
  END IF;
END
\$\$;

SELECT 'CREATE DATABASE ${DB_NAME} OWNER ${DB_USER}'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${DB_NAME}')
\gexec

GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};
SQL

sudo -u postgres psql -v ON_ERROR_STOP=1 -d "$DB_NAME" <<SQL
GRANT ALL ON SCHEMA public TO ${DB_USER};
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ${DB_USER};
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ${DB_USER};
SQL

echo "PostgreSQL ready: database=${DB_NAME} user=${DB_USER}"
