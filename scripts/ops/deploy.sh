#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$ROOT_DIR"

echo "==============================="
echo "📦 DEPLOY INICIADO: $(date)"
echo "==============================="

# Mostra o estado atual do Git
echo ""
echo "📂 Diretório atual:"
pwd

echo ""
echo "📄 Estado atual do Git:"
git status

echo ""
echo "🔄 A puxar últimas alterações do repositório..."
git pull

# Mostra o último commit
echo ""
echo "✅ Último commit:"
git log -1 --oneline

echo "🧹 Parando container atual..."
docker compose -f infra/docker-compose-prod.yml down

# Subir o container com Docker Compose
echo ""
echo "🐳 A construir e iniciar container Docker..."
docker compose -f infra/docker-compose-prod.yml up -d --build

echo ""
echo "✅ DEPLOY CONCLUÍDO COM SUCESSO!"
echo "==============================="
