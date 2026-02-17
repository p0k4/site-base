# Sentry Integration (Optional)

Este projeto suporta integração com Sentry para error tracking e monitoring.

## Setup

### 1. Criar conta no Sentry

1. Acede a [sentry.io](https://sentry.io)
2. Cria uma conta ou faz login
3. Cria um novo projeto para React e Node.js

### 2. Configurar DSN

Adiciona o Sentry DSN às variáveis de ambiente:

**API (`apps/api/.env`):**
```bash
SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_ENVIRONMENT=production
```

**Web (`apps/web/.env`):**
```bash
VITE_SENTRY_DSN=https://your-dsn@sentry.io/project-id
VITE_SENTRY_ENVIRONMENT=production
```

**Ou via `config/app.config.ts`:**
```typescript
export const appConfig = {
  // ... outras configs
  SENTRY_DSN: "https://your-dsn@sentry.io/project-id"
};
```

### 3. Instalar dependências

```bash
# API
cd apps/api
npm install @sentry/node

# Web
cd apps/web
npm install @sentry/react
```

### 4. Inicializar Sentry

**API (`apps/api/src/app.ts`):**
```typescript
import * as Sentry from '@sentry/node';

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.SENTRY_ENVIRONMENT || 'development',
    tracesSampleRate: 1.0,
  });
}

// ... resto do código
```

**Web (`apps/web/src/main.tsx`):**
```typescript
import * as Sentry from '@sentry/react';
import { appConfig } from './config/appConfig';

if (appConfig.SENTRY_DSN) {
  Sentry.init({
    dsn: appConfig.SENTRY_DSN,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}

// ... resto do código
```

## Testar

Para testar se o Sentry está a funcionar:

```typescript
// Lança um erro de teste
throw new Error('Sentry test error');
```

Deves ver o erro no dashboard do Sentry.

## Desativar

Para desativar o Sentry, simplesmente remove ou deixa vazio o `SENTRY_DSN` nas variáveis de ambiente.
