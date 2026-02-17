cd "$(dirname "$0")"
mkdir -p dump_bd

cat > backup-db.sh <<'EOS'
#!/bin/bash
set -euo pipefail

# === Configs (ajusta se precisares) ===
CONTAINER="${DB_CONTAINER:-app-db}"
DB_USER="${DB_USER:-app_user}"
DB_NAME="${DB_NAME:-app_db}"
BACKUP_DIR="${BACKUP_DIR:-$(pwd)/dump_bd}"
KEEP_DAYS="${KEEP_DAYS:-14}"

mkdir -p "$BACKUP_DIR"

TS="$(date +%F_%H-%M)"
OUT="$BACKUP_DIR/backup_${DB_NAME}_${TS}.sql"

echo "[backup] A criar backup: $OUT"
docker exec -t "$CONTAINER" pg_dump -U "$DB_USER" -d "$DB_NAME" > "$OUT"

echo "[backup] Backup criado: $(ls -lh "$OUT" | awk '{print $5, $9}')"

echo "[backup] A limpar backups com mais de $KEEP_DAYS dias..."
find "$BACKUP_DIR" -type f -name "backup_${DB_NAME}_*.sql" -mtime +$KEEP_DAYS -delete

echo "[backup] Backups atuais:"
ls -lh "$BACKUP_DIR" | tail -n 10
EOS

chmod +x backup-db.sh
