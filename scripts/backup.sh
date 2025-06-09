#!/bin/bash
set -e
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
FILE="backup-$TIMESTAMP.sql"
pg_dump "$DATABASE_URL" > "$FILE"
ln -sf "$FILE" backup.sql
echo "Backup saved to $FILE"
