#!/usr/bin/env bash
set -euo pipefail
# rotate-db-password.sh
# Usage:
#   PGPASSWORD=<admin-password> ./scripts/rotate-db-password.sh <db-host> <db-port> <db-user> <new-password> [admin-user]
# Example:
#   PGPASSWORD=oldAdminPass ./scripts/rotate-db-password.sh db.example.com 5432 guardian_admin 'NewS3cret!' postgres

if [ "$#" -lt 4 ]; then
  echo "Usage: $0 <db-host> <db-port> <db-user> <new-password> [admin-user]"
  exit 1
fi

DB_HOST="$1"
DB_PORT="$2"
DB_USER="$3"
NEW_PASS="$4"
ADMIN_USER="${5:-postgres}"

if [ -z "${PGPASSWORD-}" ]; then
  echo "Error: set PGPASSWORD env var to the current admin password before running."
  echo "Example: PGPASSWORD=oldPass $0 $DB_HOST $DB_PORT $DB_USER '$NEW_PASS' $ADMIN_USER"
  exit 2
fi

echo "Rotating password for user '$DB_USER' on $DB_HOST:$DB_PORT as admin '$ADMIN_USER'..."
psql "host=$DB_HOST port=$DB_PORT user=$ADMIN_USER sslmode=prefer" -c "ALTER USER \"$DB_USER\" WITH PASSWORD '$NEW_PASS';"

echo "✅ Password rotated for '$DB_USER'."
echo "Next steps:"
echo " - Update your CI/CD secrets (e.g., GitHub Secrets: DATABASE_URL) with the new credentials."
echo " - Restart services that depend on the DB connection."
