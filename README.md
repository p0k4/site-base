# Boilerplate Web + API (Base Multi-Cliente)

Base reutilizável para projetos com frontend React + Vite e backend Node.js + Express.
O branding (nome, cores, logo, favicon e textos de marca) é configurável num ficheiro central.

## Stack
- Frontend: React + Vite + TypeScript + TailwindCSS
- Backend: Node.js + Express
- Base de dados: PostgreSQL
- Auth: JWT (access + refresh) + bcrypt
- Infra: Docker Compose (api + db)

## Estrutura
```
/apps
  /web   -> React (Vite)
  /api   -> Express
/config  -> Branding (app.config.ts)
/infra   -> Docker Compose + migrations
README.md
```

## Configuração rápida

### 1) Variáveis de ambiente
Cria os ficheiros a partir dos exemplos:
- `apps/api/.env` (copiar de `apps/api/.env.example`)
- `apps/api/.env.test` (opcional, copiar de `apps/api/.env.test.example`)
- `apps/web/.env` (copiar de `apps/web/.env.example`)
- `infra/.env` (para docker-prod, copiar de `infra/.env.example`)

### 2) Branding central
Copia o template e ajusta os valores:
- `config/app.config.ts` (copiar de `config/app.config.example.ts`)

Campos principais:
- `APP_NAME`
- `PRIMARY_COLOR`, `SECONDARY_COLOR`
- `BRAND_LOGO_PATH`, `BRAND_FAVICON_PATH`
- `DOMAIN`, `CORS_ORIGIN`
- Textos de marca (`TEXTS`) e dados públicos (`COMPANY`)

Assets padrão:
- `apps/web/public/assets/brand-logo.svg`
- `apps/web/public/assets/brand-favicon.svg`

Se quiseres trocar os assets, mantém os caminhos definidos em `app.config.ts`.

## Como correr localmente

### 1) API + DB + Web (Docker)
```bash
cd infra
docker compose up --build
```
A API fica em `http://localhost:4000` e o frontend em `http://localhost:5173`.

### 2) Frontend
```bash
cd apps/web
npm install
npm run dev
```
A web app fica em `http://localhost:5173`.

### 3) API local (sem Docker)
```bash
cd apps/api
npm install
npm run dev
```

## Deploy (resumo)
1. Ajustar `infra/.env` com valores reais (DB, JWT, CORS).
2. Garantir que `config/app.config.ts` está com branding final.
3. Fazer build e deploy conforme o provider.

## Notas
- Não comitar `.env` nem `config/app.config.ts` (usa os exemplos).
- O branding é aplicado via `config/app.config.ts` e CSS variables.

## Mensagem de commit sugerida
`feat: scaffold base boilerplate para múltiplos clientes`
