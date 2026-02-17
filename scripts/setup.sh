#!/bin/bash

# Site-base Setup Script
# Configura automaticamente o projeto para desenvolvimento

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

echo "🚀 Site-base Setup"
echo "===================="
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Copiar ficheiros de ambiente
echo "📋 A copiar ficheiros de configuração..."

if [ ! -f "apps/api/.env" ]; then
  cp apps/api/.env.example apps/api/.env
  echo -e "${GREEN}✓${NC} Criado apps/api/.env"
else
  echo -e "${YELLOW}⚠${NC} apps/api/.env já existe (não foi substituído)"
fi

if [ ! -f "apps/api/.env.test" ]; then
  cp apps/api/.env.test.example apps/api/.env.test
  echo -e "${GREEN}✓${NC} Criado apps/api/.env.test"
else
  echo -e "${YELLOW}⚠${NC} apps/api/.env.test já existe (não foi substituído)"
fi

if [ ! -f "apps/web/.env" ]; then
  cp apps/web/.env.example apps/web/.env
  echo -e "${GREEN}✓${NC} Criado apps/web/.env"
else
  echo -e "${YELLOW}⚠${NC} apps/web/.env já existe (não foi substituído)"
fi

if [ ! -f "infra/.env" ]; then
  cp infra/.env.example infra/.env
  echo -e "${GREEN}✓${NC} Criado infra/.env"
else
  echo -e "${YELLOW}⚠${NC} infra/.env já existe (não foi substituído)"
fi

# 2. Copiar configuração de branding
echo ""
echo "🎨 A copiar configuração de branding..."

if [ ! -f "config/app.config.ts" ]; then
  cp config/app.config.example.ts config/app.config.ts
  echo -e "${GREEN}✓${NC} Criado config/app.config.ts"
else
  echo -e "${YELLOW}⚠${NC} config/app.config.ts já existe (não foi substituído)"
fi

# 3. Instalar dependências
echo ""
echo "📦 A instalar dependências..."
echo "Isto pode demorar alguns minutos..."
echo ""

npm install

echo ""
echo -e "${GREEN}✓${NC} Dependências instaladas"

# 4. Mensagem final
echo ""
echo "✅ Setup concluído!"
echo ""
echo "Próximos passos:"
echo "----------------"
echo "1. Edita config/app.config.ts com o branding do teu projeto"
echo "2. Edita apps/api/.env e infra/.env com as tuas configurações"
echo "3. (Opcional) Substitui os assets em apps/web/public/assets/"
echo ""
echo "Para iniciar o projeto:"
echo "  npm run dev          # Inicia stack completa (Docker)"
echo "  npm run dev:api      # Apenas API"
echo "  npm run dev:web      # Apenas frontend"
echo ""
echo "A API ficará em: http://localhost:4000"
echo "O frontend em: http://localhost:5174"
echo ""
