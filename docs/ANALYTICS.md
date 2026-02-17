# Analytics Integration (Optional)

Este projeto suporta Google Analytics e Plausible para tracking de uso.

## Configuração

### Via `config/app.config.ts`

```typescript
export const appConfig = {
  // ... outras configs
  
  // Opção 1: Google Analytics
  ANALYTICS_PROVIDER: "google",
  ANALYTICS_ID: "G-XXXXXXXXXX", // Measurement ID
  
  // Opção 2: Plausible
  ANALYTICS_PROVIDER: "plausible",
  ANALYTICS_ID: "yourdomain.com",
  
  // Opção 3: Desativado
  ANALYTICS_PROVIDER: "none",
  ANALYTICS_ID: "",
};
```

## Google Analytics

### 1. Criar propriedade

1. Acede a [Google Analytics](https://analytics.google.com)
2. Cria uma nova propriedade
3. Copia o Measurement ID (formato: `G-XXXXXXXXXX`)

### 2. Configurar

```typescript
ANALYTICS_PROVIDER: "google",
ANALYTICS_ID: "G-XXXXXXXXXX",
```

### 3. Tracking de eventos

```typescript
import { analytics } from '@/lib/analytics';

// Track custom event
analytics.trackEvent({
  name: 'button_click',
  properties: {
    button_name: 'signup',
    page: 'home'
  }
});
```

## Plausible

### 1. Criar conta

1. Acede a [Plausible](https://plausible.io)
2. Adiciona o teu domínio
3. Usa o domínio como ANALYTICS_ID

### 2. Configurar

```typescript
ANALYTICS_PROVIDER: "plausible",
ANALYTICS_ID: "yourdomain.com",
```

### 3. Tracking de eventos

```typescript
import { analytics } from '@/lib/analytics';

// Track custom event
analytics.trackEvent({
  name: 'Signup',
  properties: {
    plan: 'premium'
  }
});
```

## Privacidade

- ✅ **Opt-in**: Analytics só ativa se configurado
- ✅ **Sem tracking por defeito**: `ANALYTICS_PROVIDER: "none"`
- ✅ **GDPR friendly**: Plausible não usa cookies
- ⚠️ **Google Analytics**: Requer cookie consent banner

## Desativar

Para desativar analytics:

```typescript
ANALYTICS_PROVIDER: "none",
```

Ou simplesmente não configures `ANALYTICS_ID`.
