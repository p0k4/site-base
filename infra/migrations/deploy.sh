#!/bin/bash

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

if [ $? -ne 0 ]; then
  echo "❌ Erro ao fazer git pull"
  exit 1
fi

# Mostra o último commit
echo ""
echo "✅ Último commit:"
git log -1 --oneline

echo "🧹 Parando container atual..."
docker compose -f docker-compose-prod.yml down

# Subir o container com Docker Compose
echo ""
echo "🐳 A construir e iniciar container Docker..."
docker compose -f docker-compose-prod.yml up -d --build

if [ $? -ne 0 ]; then
  echo "❌ Erro ao iniciar container Docker"
  exit 1
fi

echo ""
echo "✅ DEPLOY CONCLUÍDO COM SUCESSO!"
echo "==============================="
