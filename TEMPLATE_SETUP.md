# Guia: Usar site-base Como Template

Este guia mostra como usar este boilerplate para criar um novo projeto para um cliente.

## 📋 Checklist de Setup

### 1. Clonar e Preparar

```bash
# Clona o repositório
git clone <url-do-repo> nome-do-novo-projeto
cd nome-do-novo-projeto

# Remove histórico git antigo
rm -rf .git
git init
git add .
git commit -m "feat: initial commit from site-base template"
```

### 2. Configurar Branding

#### a) Editar `config/app.config.ts`

```typescript
export const appConfig = {
  APP_NAME: "Nome do Cliente",
  PRIMARY_COLOR: "#123456",        // Cor principal do cliente
  SECONDARY_COLOR: "#789ABC",      // Cor secundária
  BRAND_LOGO_PATH: "/assets/brand-logo.svg",
  BRAND_FAVICON_PATH: "/assets/brand-favicon.svg",
  DOMAIN: "cliente.com",
  CORS_ORIGIN: "https://cliente.com",
  TEXTS: {
    HERO_TITLE: "Título específico do cliente",
    HERO_SUBTITLE: "Subtítulo do cliente",
    TAGLINE: "Tagline do cliente",
    ADMIN_SECTION_TITLE: "Gestão {APP_NAME}",
    FOOTER_COPYRIGHT: "© 2024 Nome do Cliente. Todos os direitos reservados.",
    CONTACT_RESPONSE_TIME: "Resposta em 24h",
    SEO_TITLE: "{APP_NAME} | Descrição",
    SEO_DESCRIPTION: "Meta description para SEO"
  },
  COMPANY: {
    LOCATION: "Lisboa, Portugal",
    EMAIL: "contacto@cliente.com",
    PHONE: "+351 123 456 789"
  }
};
```

#### b) Substituir Assets

Coloca os ficheiros do cliente em `apps/web/public/assets/`:

- **brand-logo.svg** - Logo do cliente (formato SVG recomendado)
- **brand-favicon.svg** - Favicon do cliente

> 💡 **Dica**: Mantém os nomes dos ficheiros ou atualiza os caminhos em `app.config.ts`

### 3. Configurar Variáveis de Ambiente

#### Desenvolvimento (`apps/api/.env`)

```bash
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_USER=cliente_user
DB_PASSWORD=dev_password
DB_NAME=cliente_db
JWT_ACCESS_SECRET=gerar_string_aleatoria_longa
JWT_REFRESH_SECRET=gerar_outra_string_aleatoria
CORS_ORIGIN=http://localhost:5174
```

#### Produção (`infra/.env`)

```bash
DB_NAME=cliente_db_prod
DB_USER=cliente_user_prod
DB_PASSWORD=PASSWORD_FORTE_ALEATORIO
JWT_ACCESS_SECRET=STRING_ALEATORIA_MUITO_SEGURA
JWT_REFRESH_SECRET=OUTRA_STRING_DIFERENTE
CORS_ORIGIN=https://cliente.com
VITE_API_URL=https://api.cliente.com
```

> ⚠️ **Importante**: Gera secrets fortes para produção!

```bash
# Gerar secrets aleatórios
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Personalizar package.json

Edita `package.json` (raiz), `apps/api/package.json` e `apps/web/package.json`:

```json
{
  "name": "cliente-app",
  "description": "Plataforma do Cliente XYZ",
  "repository": {
    "type": "git",
    "url": "https://github.com/tua-org/cliente-app"
  },
  "author": "Tua Empresa"
}
```

### 5. Customizar Schema da Base de Dados (Opcional)

Se precisares de campos adicionais, edita:

**`infra/init-db.sql`**

```sql
-- Exemplo: adicionar campo à tabela users
ALTER TABLE users ADD COLUMN company_name TEXT;

-- Ou criar novas tabelas
CREATE TABLE custom_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- campos...
);
```

### 6. Atualizar README

Edita `README.md` com informação específica do projeto:

- Nome do cliente
- Descrição do projeto
- Instruções específicas de deploy
- Contactos da equipa

### 7. Executar Setup

```bash
npm run setup
```

Isto vai:
- Copiar todos os `.env.example` para `.env`
- Copiar `app.config.example.ts` para `app.config.ts`
- Instalar dependências

### 8. Testar Localmente

```bash
# Inicia stack completa
npm run dev
```

Verifica:
- ✅ Frontend em http://localhost:5174
- ✅ API em http://localhost:4000
- ✅ Health check em http://localhost:4000/health
- ✅ Branding correto (cores, logo, textos)

### 9. Criar Primeiro Admin

```bash
# Conecta à base de dados
docker exec -it site-base-dev-db-1 psql -U cliente_user -d cliente_db

# Gera password hash
cd apps/api
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('admin_password', 10));"

# Insere admin (usa o hash gerado acima)
INSERT INTO users (name, email, password_hash, role)
VALUES ('Admin', 'admin@cliente.com', '<hash_gerado>', 'admin');
```

### 10. Configurar Git Remoto

```bash
# Adiciona repositório remoto do novo projeto
git remote add origin https://github.com/tua-org/cliente-app.git
git branch -M main
git push -u origin main
```

## 🎨 Customizações Comuns

### Adicionar Nova Página

1. Cria componente em `apps/web/src/pages/NovaPagina.tsx`
2. Adiciona rota em `apps/web/src/App.tsx`:

```tsx
<Route path="/nova-pagina" element={<NovaPagina />} />
```

### Adicionar Novo Endpoint

1. Cria validator em `apps/api/src/validators/`
2. Cria service em `apps/api/src/services/`
3. Cria controller em `apps/api/src/controllers/`
4. Adiciona rota em `apps/api/src/routes/`
5. Regista rota em `apps/api/src/app.ts`

### Modificar Cores do Tema

As cores são geradas automaticamente a partir de `PRIMARY_COLOR` e `SECONDARY_COLOR` em `app.config.ts`.

O sistema gera escalas de 50 a 900 automaticamente. Podes usar no CSS:

```css
/* Variáveis geradas automaticamente */
--brand-50 até --brand-900
--accent-50 até --accent-400
```

### Adicionar Novos Textos de Branding

Edita `config/app.config.ts`:

```typescript
TEXTS: {
  // ... textos existentes
  MEU_NOVO_TEXTO: "Valor do texto"
}
```

Usa em React:

```tsx
import { brandText } from '@/config/branding';

<h1>{brandText.meuNovoTexto}</h1>
```

## 🚀 Deploy

### Preparação

1. **Atualiza `infra/.env`** com valores de produção
2. **Gera secrets fortes** para JWT
3. **Configura domínio** e DNS
4. **Configura SSL/TLS** (Let's Encrypt recomendado)

### Opções de Deploy

#### Docker Compose (VPS)

```bash
cd infra
docker compose -f docker-compose-prod.yml up -d
```

#### Build Manual

```bash
# API
cd apps/api
npm run build
npm start

# Web (servir com nginx)
cd apps/web
npm run build
# Servir pasta dist/
```

## ✅ Checklist Final

Antes de entregar ao cliente:

- [ ] Branding completo aplicado (cores, logo, textos)
- [ ] Todos os `.env` configurados corretamente
- [ ] Assets do cliente substituídos
- [ ] Primeiro admin criado
- [ ] Testes básicos passam
- [ ] Health check funciona
- [ ] README atualizado
- [ ] Repositório git configurado
- [ ] CI/CD a funcionar (se aplicável)
- [ ] Deploy de staging testado
- [ ] Documentação específica do cliente criada

## 🆘 Problemas Comuns

### Branding não atualiza

```bash
# Limpa cache do Vite
cd apps/web
rm -rf node_modules/.vite
npm run dev
```

### Cores não aparecem corretas

Verifica que `PRIMARY_COLOR` e `SECONDARY_COLOR` estão em formato hex válido (`#RRGGBB`).

### Logo não aparece

1. Verifica que o ficheiro existe em `apps/web/public/assets/`
2. Confirma que o caminho em `app.config.ts` está correto
3. Restart do frontend

## 📚 Recursos

- [Documentação React](https://react.dev)
- [Documentação Vite](https://vitejs.dev)
- [Documentação Express](https://expressjs.com)
- [Documentação PostgreSQL](https://www.postgresql.org/docs/)
- [TailwindCSS](https://tailwindcss.com)
- [DaisyUI](https://daisyui.com)

---

**Boa sorte com o novo projeto! 🚀**
