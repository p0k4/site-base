# Boilerplate Web + API (Base Multi-Cliente)

Base reutilizável para projetos com frontend React + Vite e backend Node.js + Express.
O branding (nome, cores, logo, favicon e textos de marca) é configurável num ficheiro central.

## 📋 Requisitos

- **Node.js** >= 20.0.0
- **npm** >= 10.0.0
- **Docker** e **Docker Compose** (para desenvolvimento local)
- **PostgreSQL** 16+ (se correr sem Docker)

## 🚀 Stack Tecnológica

- **Frontend**: React + Vite + TypeScript + TailwindCSS + DaisyUI
- **Backend**: Node.js + Express + TypeScript
- **Base de dados**: PostgreSQL 16
- **Autenticação**: JWT (access + refresh tokens) + bcrypt
- **Validação**: Zod
- **Infraestrutura**: Docker Compose
- **CI/CD**: GitHub Actions

## 📁 Estrutura do Projeto

```
site-base/
├── apps/
│   ├── api/              # Backend (Express + TypeScript)
│   │   ├── src/
│   │   │   ├── config/   # Configuração (env, db)
│   │   │   ├── controllers/  # Lógica de endpoints
│   │   │   ├── middleware/   # Auth, validação, rate limiting
│   │   │   ├── routes/       # Definição de rotas
│   │   │   ├── services/     # Camada de dados
│   │   │   ├── utils/        # Helpers (JWT, password, files)
│   │   │   └── validators/   # Schemas Zod
│   │   └── Dockerfile
│   └── web/              # Frontend (React + Vite)
│       ├── src/
│       │   ├── components/   # Componentes reutilizáveis
│       │   ├── config/       # Branding e configuração
│       │   ├── contexts/     # React contexts (Auth)
│       │   ├── lib/          # API client, helpers
│       │   ├── pages/        # Páginas da aplicação
│       │   └── styles/       # CSS global
│       └── Dockerfile
├── config/
│   └── app.config.ts     # ⚙️ Branding central (cores, textos, logo)
├── infra/
│   ├── docker-compose.yml       # Stack de desenvolvimento
│   ├── docker-compose-prod.yml  # Stack de produção
│   ├── init-db.sql              # Schema inicial
│   └── migrations/              # Migrações SQL
├── scripts/
│   ├── setup.sh                 # Setup automático do projeto
│   ├── ops/
│   │   └── deploy.sh            # Deploy produção na VPS
│   └── db/
│       └── backup-bd.sh         # Script auxiliar de backups
├── .github/
│   └── workflows/
│       └── ci.yml        # CI/CD automático
├── package.json          # Scripts de gestão
└── README.md
```

## ⚡ Setup Rápido

### Opção 1: Setup Automático (Recomendado)

```bash
npm run setup
```

Este script:
- ✅ Copia todos os ficheiros `.env.example` → `.env`
- ✅ Copia `config/app.config.example.ts` → `config/app.config.ts`
- ✅ Instala todas as dependências

### Opção 2: Setup Manual

1. **Copiar ficheiros de configuração:**

```bash
# API
cp apps/api/.env.example apps/api/.env
cp apps/api/.env.test.example apps/api/.env.test

# Web
cp apps/web/.env.example apps/web/.env

# Infra (para produção)
cp infra/.env.example infra/.env

# Branding
cp config/app.config.example.ts config/app.config.ts
```

2. **Instalar dependências:**

```bash
npm install
```

## 🎨 Configuração de Branding

Edita `config/app.config.ts` para personalizar:

```typescript
export const appConfig = {
  APP_NAME: "Nome da Tua Marca",
  PRIMARY_COLOR: "#B89363",      // Cor principal
  SECONDARY_COLOR: "#C7A17A",    // Cor secundária
  BRAND_LOGO_PATH: "/assets/brand-logo.svg",
  BRAND_FAVICON_PATH: "/assets/brand-favicon.svg",
  DOMAIN: "teu-dominio.com",
  CORS_ORIGIN: "https://teu-dominio.com",
  TEXTS: {
    HERO_TITLE: "O teu título principal",
    HERO_SUBTITLE: "Subtítulo descritivo",
    // ... mais textos
  },
  COMPANY: {
    LOCATION: "Cidade, País",
    EMAIL: "contacto@exemplo.pt",
    PHONE: "+351 000 000 000"
  }
};
```

### Assets de Branding

Substitui os ficheiros em `apps/web/public/assets/`:
- `brand-logo.svg` - Logo da marca
- `brand-favicon.svg` - Favicon

## 🏃 Como Correr

### Desenvolvimento (Docker - Recomendado)

Inicia toda a stack (API + DB + Web):

```bash
npm run dev
```

- **API**: http://localhost:4000
- **Frontend**: http://localhost:5174
- **Health Check**: http://localhost:4000/health

### Desenvolvimento Local (sem Docker)

**Terminal 1 - API:**
```bash
npm run dev:api
```

**Terminal 2 - Frontend:**
```bash
npm run dev:web
```

> ⚠️ **Nota**: Precisas de PostgreSQL a correr localmente e configurar `apps/api/.env` com as credenciais corretas.

## 📝 Scripts Disponíveis

```bash
# Setup
npm run setup              # Setup automático completo

# Desenvolvimento
npm run dev                # Stack completa (Docker)
npm run dev:api            # Apenas API
npm run dev:web            # Apenas frontend

# Build
npm run build:api          # Build da API
npm run build:web          # Build do frontend

# Qualidade de Código
npm run type-check:api     # Verificar tipos TypeScript (API)
npm run type-check:web     # Verificar tipos TypeScript (Web)
npm run lint:api           # Lint da API
npm run lint:web           # Lint do frontend

# Testes
npm run test:api           # Testes da API

# Instalação
npm run install:all        # Instala deps em todos os workspaces
```

## 🔐 Segurança

### Autenticação
- **JWT** com access tokens (15min) e refresh tokens (30 dias)
- **Passwords** hasheadas com bcrypt (10 rounds)
- **Refresh tokens** armazenados na DB com possibilidade de revogação

### Rate Limiting
- Login: 5 tentativas / 15 minutos
- Register: 3 registos / hora
- API geral: 100 requests / 15 minutos

### Headers de Segurança
- **Helmet.js** para headers HTTP seguros
- **CORS** configurável por ambiente

### Variáveis Sensíveis
⚠️ **NUNCA** comitar:
- Ficheiros `.env`
- `config/app.config.ts`

Usa sempre os ficheiros `.example` como template.

## 🗄️ Base de Dados

### Schema Principal

- **users** - Utilizadores (com roles: user, admin)
- **listings** - Anúncios (tabela padrão)
- **listing_images** - Imagens dos anúncios
- **services** - Serviços disponíveis
- **leads_contacts** - Leads/contactos
- **refresh_tokens** - Tokens de refresh
- **app_company_settings** - Configurações da empresa

### Migrations

Migrations estão em `infra/migrations/`. Para aplicar:

```bash
# Dentro do container da DB ou com psql local
psql -U app_user -d app_db -f infra/migrations/nome_da_migration.sql
```

Se já tiveres uma base existente com a tabela antiga `car_listings`, aplica também:

```bash
psql -U app_user -d app_db -f infra/migrations/20260217_rename_car_listings_to_listings.sql
```

### Criar Primeiro Admin

```sql
-- Conecta à base de dados
psql -U app_user -d app_db

-- Cria utilizador admin (password: admin123)
INSERT INTO users (name, email, password_hash, role)
VALUES (
  'Admin',
  'admin@example.com',
  '$2a$10$rGHQqLvYvJ5qvZ5qvZ5qvOX5qvZ5qvZ5qvZ5qvZ5qvZ5qvZ5qvZ5q',
  'admin'
);
```

> 💡 **Dica**: Gera um hash bcrypt real usando:
> ```bash
> cd apps/api
> node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('tua_password', 10));"
> ```

## 🚀 Deploy

### Variáveis Críticas de Produção

Em `infra/.env` (produção):

```bash
# Database (usar valores seguros!)
DB_PASSWORD=password_forte_aleatorio

# JWT (gerar strings aleatórias longas)
JWT_ACCESS_SECRET=string_aleatoria_muito_longa_e_segura
JWT_REFRESH_SECRET=outra_string_aleatoria_diferente

# CORS (domínio real)
CORS_ORIGIN=https://teu-dominio.com

# Frontend
VITE_API_URL=https://teu-dominio.com/api
```

### Build para Produção

```bash
# API
cd apps/api
npm run build
npm start

# Web
cd apps/web
npm run build
# Servir pasta dist/ com nginx ou similar
```

### Docker Compose Produção

```bash
cd infra
docker compose -f docker-compose-prod.yml up -d
```

### Deploy Automatizado na VPS (`deploy.sh`)

Foi adicionado o script `scripts/ops/deploy.sh` para facilitar deploy manual via Bash na VPS.

**Pré-requisitos**:
- Docker e Docker Compose instalados na VPS
- Repositório já clonado na VPS
- Acesso ao remoto Git configurado no servidor (SSH key ou credenciais)

**Como usar**:

```bash
# Na VPS
cd /caminho/do/projeto
chmod +x scripts/ops/deploy.sh
./scripts/ops/deploy.sh
```

**O script faz**:
1. Mostra `pwd` e `git status`
2. Executa `git pull`
3. Mostra o último commit aplicado
4. Executa `docker compose -f infra/docker-compose-prod.yml down`
5. Executa `docker compose -f infra/docker-compose-prod.yml up -d --build`

## 🐛 Troubleshooting

### Problema: "Cannot connect to database"

**Solução**:
1. Verifica se PostgreSQL está a correr: `docker ps`
2. Confirma credenciais em `apps/api/.env`
3. Testa conexão: `psql -h localhost -p 5432 -U app_user -d app_db`

### Problema: "Port 4000 already in use"

**Solução**:
```bash
# Encontra processo
lsof -i :4000

# Mata processo
kill -9 <PID>
```

### Problema: "CORS error" no frontend

**Solução**:
1. Verifica `CORS_ORIGIN` em `apps/api/.env`
2. Deve corresponder ao URL do frontend (ex: `http://localhost:5174`)

### Problema: Mudanças em `app.config.ts` não aparecem

**Solução**:
```bash
# Restart do frontend
cd apps/web
npm run dev
```

O branding é aplicado no build-time, não runtime.

### Problema: Docker build falha

**Solução**:
```bash
# Limpa cache do Docker
docker system prune -a

# Rebuild
cd infra
docker compose up --build --force-recreate
```

## 📚 Usar Como Template

Vê o guia completo em [TEMPLATE_SETUP.md](./TEMPLATE_SETUP.md) para instruções detalhadas de como usar este projeto como base para um novo cliente.

## 🧪 Testes

```bash
# Testes da API
cd apps/api
npm test

# Com cobertura
npm test -- --coverage
```

## 🎨 Linting e Formatação

O projeto usa **ESLint** e **Prettier** para garantir qualidade e consistência de código.

### Executar Lint

```bash
# Lint em todo o projeto
npm run lint

# Lint apenas API
npm run lint:api

# Lint apenas Web
npm run lint:web

# Fix automático
cd apps/api && npm run lint:fix
cd apps/web && npm run lint:fix
```

### Formatação

```bash
# Formatar todo o código
npm run format

# Formatar apenas API
npm run format:api

# Formatar apenas Web
npm run format:web

# Verificar formatação sem alterar
cd apps/api && npm run format:check
```

### Configuração

- **ESLint**: `.eslintrc.json` em `apps/api` e `apps/web`
- **Prettier**: `.prettierrc.json` na raiz
- **EditorConfig**: `.editorconfig` para consistência entre IDEs

## 🧪 Testes E2E (Playwright)

Testes end-to-end com Playwright para validar fluxos completos.

### Executar Testes

```bash
# Executar todos os testes E2E
npm run test:e2e

# Modo UI (interativo)
npm run test:e2e:ui

# Com browser visível
npm run test:e2e:headed
```

### Testes Disponíveis

- **health.spec.ts** - Health check da API e carregamento do frontend
- **auth.spec.ts** - Login, register, validações
- **listings.spec.ts** - Browse, filtros, detalhes de anúncios

### Configuração

Edita `playwright.config.ts` para ajustar:
- Browsers a testar (chromium, firefox, webkit)
- Base URL
- Screenshots e vídeos
- Retries

## 📚 Storybook

Documentação visual e interativa dos componentes React.

### Executar Storybook

```bash
# Iniciar Storybook
npm run storybook

# Acede a http://localhost:6006
```

### Build Storybook

```bash
cd apps/web
npm run build-storybook
```

### Stories Disponíveis

- **ListingCard** - Card de anúncio com variações
- **Toast** - Notificações de sucesso/erro
- _(Adiciona mais stories em `src/components/*.stories.tsx`)_

## 📊 Monitoring (Opcional)

### Sentry

Integração com Sentry para error tracking e performance monitoring.

**Setup:**
1. Cria conta em [sentry.io](https://sentry.io)
2. Adiciona DSN em `config/app.config.ts`:

```typescript
SENTRY_DSN: "https://your-dsn@sentry.io/project-id"
```

3. Instala dependências:

```bash
cd apps/api && npm install @sentry/node
cd apps/web && npm install @sentry/react
```

📖 **Documentação completa**: [docs/SENTRY.md](./docs/SENTRY.md)

## 📈 Analytics (Opcional)

Suporte para Google Analytics e Plausible.

**Setup em `config/app.config.ts`:**

```typescript
// Google Analytics
ANALYTICS_PROVIDER: "google",
ANALYTICS_ID: "G-XXXXXXXXXX",

// OU Plausible
ANALYTICS_PROVIDER: "plausible",
ANALYTICS_ID: "yourdomain.com",

// OU Desativado
ANALYTICS_PROVIDER: "none",
```

**Tracking de eventos:**

```typescript
import { analytics } from '@/lib/analytics';

analytics.trackEvent({
  name: 'button_click',
  properties: { button_name: 'signup' }
});
```

📖 **Documentação completa**: [docs/ANALYTICS.md](./docs/ANALYTICS.md)

## 📄 Licença

MIT

## 🤝 Contribuir

1. Fork o projeto
2. Cria uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit as mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abre um Pull Request

---

**Desenvolvido com ❤️ para ser reutilizável e escalável**
