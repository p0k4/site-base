export const appConfig = {
  APP_NAME: "Nome da Marca",
  PRIMARY_COLOR: "#B89363",
  SECONDARY_COLOR: "#C7A17A",
  BRAND_LOGO_PATH: "/assets/brand-logo.svg",
  BRAND_FAVICON_PATH: "/assets/brand-favicon.svg",
  DOMAIN: "example.com",
  CORS_ORIGIN: "http://localhost:5174",
  TEXTS: {
    HERO_TITLE: "Publica e gere anuncios em minutos.",
    HERO_SUBTITLE: "Uma base flexivel para qualquer area de negocio.",
    TAGLINE: "Marketplace flexivel para qualquer nicho.",
    ADMIN_SECTION_TITLE: "Gestão {APP_NAME}",
    FOOTER_COPYRIGHT: "Todos os direitos reservados.",
    CONTACT_RESPONSE_TIME: "Resposta em 24h",
    SEO_TITLE: "{APP_NAME} | Marketplace digital",
    SEO_DESCRIPTION: "Plataforma para publicar anuncios, gerir contactos e oferecer servicos."
  },
  COMPANY: {
    LOCATION: "Cidade, País",
    EMAIL: "contacto@exemplo.pt",
    PHONE: "+351 000 000 000"
  },
  // Optional: Analytics (google | plausible | none)
  ANALYTICS_PROVIDER: "none" as "google" | "plausible" | "none",
  ANALYTICS_ID: "", // Google Measurement ID or Plausible domain
  // Optional: Error Monitoring
  SENTRY_DSN: "" // Leave empty to disable
} as const;

export type AppConfig = typeof appConfig;
