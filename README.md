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
├── .github/
│   └── workflows/
│       └── ci.yml        # CI/CD automático
├── package.json          # Scripts de gestão
├── setup.sh              # Script de setup automático
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
- **car_listings** - Anúncios de veículos
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
