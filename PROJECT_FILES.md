# Project Files

Short descriptions of all project files (excluding `node_modules` and `uploads`).

| Path | Description |
| --- | --- |
| README.md | Project overview and setup notes. |
| config/app.config.example.ts | Branding configuration template. |
| config/app.config.ts | Branding configuration (local override). |
| apps/api/Dockerfile | Docker image build for the API service. |
| apps/api/package.json | API dependencies and scripts. |
| apps/api/package-lock.json | Locked dependency tree for the API. |
| apps/api/tsconfig.json | TypeScript config for the API. |
| apps/api/src/index.ts | API process entrypoint. |
| apps/api/src/app.ts | Express app setup and middleware. |
| apps/api/src/config/env.ts | Env var parsing and defaults. |
| apps/api/src/config/db.ts | Postgres client setup. |
| apps/api/src/controllers/adminController.ts | Admin endpoints handler logic. |
| apps/api/src/controllers/authController.ts | Auth endpoints handler logic. |
| apps/api/src/controllers/leadsController.ts | Leads endpoints handler logic. |
| apps/api/src/controllers/listingsController.ts | Listings endpoints handler logic. |
| apps/api/src/controllers/servicesController.ts | Services endpoints handler logic. |
| apps/api/src/controllers/usersController.ts | Users endpoints handler logic. |
| apps/api/src/middleware/admin.ts | Admin-only access guard. |
| apps/api/src/middleware/auth.ts | Auth middleware and JWT verification. |
| apps/api/src/middleware/error.ts | Global error and 404 handling. |
| apps/api/src/middleware/optionalAuth.ts | Optional auth parsing. |
| apps/api/src/middleware/rateLimit.ts | Rate limit configurations. |
| apps/api/src/middleware/validate.ts | Zod request validation middleware. |
| apps/api/src/routes/admin.ts | Admin API routes. |
| apps/api/src/routes/auth.ts | Auth API routes. |
| apps/api/src/routes/leads.ts | Leads API routes. |
| apps/api/src/routes/listings.ts | Listings API routes. |
| apps/api/src/routes/services.ts | Services API routes. |
| apps/api/src/routes/users.ts | Users API routes. |
| apps/api/src/services/leadsService.ts | Leads data access layer. |
| apps/api/src/services/listingsService.ts | Listings data access layer. |
| apps/api/src/services/refreshTokensService.ts | Refresh token storage logic. |
| apps/api/src/services/servicesService.ts | Services data access layer. |
| apps/api/src/services/usersService.ts | Users data access layer. |
| apps/api/src/utils/externalSources.ts | External source URL validation/normalization. |
| apps/api/src/utils/files.ts | File system helper utilities. |
| apps/api/src/utils/jwt.ts | JWT sign/verify helpers. |
| apps/api/src/utils/password.ts | Password hashing utilities. |
| apps/api/src/validators/auth.ts | Zod schema for auth requests. |
| apps/api/src/validators/leads.ts | Zod schema for leads requests. |
| apps/api/src/validators/listings.ts | Zod schema for listings requests. |
| apps/api/src/validators/services.ts | Zod schema for services requests. |
| apps/api/src/validators/users.ts | Zod schema for user requests. |
| apps/web/Dockerfile | Docker image build for the web app. |
| apps/web/index.html | Vite HTML entry. |
| apps/web/package.json | Web app dependencies and scripts. |
| apps/web/package-lock.json | Locked dependency tree for the web app. |
| apps/web/postcss.config.cjs | PostCSS configuration. |
| apps/web/tailwind.config.ts | Tailwind theme and config. |
| apps/web/tsconfig.json | TypeScript config for the web app. |
| apps/web/vite.config.ts | Vite build and dev config. |
| apps/web/public/placeholder.svg | Placeholder image asset. |
| apps/web/public/assets/brand-logo.svg | Default brand logo asset. |
| apps/web/public/assets/brand-favicon.svg | Default favicon asset. |
| apps/web/src/App.tsx | React router and app shell. |
| apps/web/src/main.tsx | React entrypoint. |
| apps/web/src/vite-env.d.ts | Vite type declarations. |
| apps/web/src/contexts/AuthContext.tsx | Auth context and state. |
| apps/web/src/components/AdminRoute.tsx | Route guard for admin pages. |
| apps/web/src/components/FiltersPanel.tsx | Filters UI for listings. |
| apps/web/src/components/ListingCard.tsx | Listing card UI component. |
| apps/web/src/components/ProtectedRoute.tsx | Route guard for authenticated users. |
| apps/web/src/components/ServiceCard.tsx | Service card UI component. |
| apps/web/src/components/SiteFooter.tsx | Site footer UI. |
| apps/web/src/components/SiteHeader.tsx | Site header UI. |
| apps/web/src/components/Toast.tsx | Toast notification UI. |
| apps/web/src/lib/api.ts | Axios client setup. |
| apps/web/src/lib/media.ts | Media URL resolution helpers. |
| apps/web/src/pages/Admin.tsx | Admin dashboard page. |
| apps/web/src/pages/CarDetail.tsx | Listing detail page. |
| apps/web/src/pages/Cars.tsx | Listings search/browse page. |
| apps/web/src/pages/Dashboard.tsx | User dashboard and listing editor. |
| apps/web/src/pages/Home.tsx | Home page with highlights. |
| apps/web/src/pages/Login.tsx | Login page. |
| apps/web/src/pages/Register.tsx | Register page. |
| apps/web/src/pages/Services.tsx | Services listing page. |
| apps/web/src/styles/index.css | Global styles and Tailwind layers. |
| infra/docker-compose.yml | Local dev compose stack. |
| infra/init-db.sql | Initial database schema and seed. |
| infra/migrations/20260125_add_listing_external_source_fields.sql | Migration for listing external source fields. |
