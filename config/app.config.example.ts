export const appConfig = {
  APP_NAME: "Nome da Marca",
  PRIMARY_COLOR: "#B89363",
  SECONDARY_COLOR: "#C7A17A",
  BRAND_LOGO_PATH: "/assets/brand-logo.svg",
  BRAND_FAVICON_PATH: "/assets/brand-favicon.svg",
  DOMAIN: "example.com",
  CORS_ORIGIN: "http://localhost:5173",
  TEXTS: {
    HERO_TITLE: "O teu próximo carro servido no ponto.",
    HERO_SUBTITLE: "Uma nova forma de comprar carro, com acompanhamento e serviços completos.",
    TAGLINE: "O teu próximo carro servido no ponto.",
    ADMIN_SECTION_TITLE: "Gestão {APP_NAME}",
    FOOTER_COPYRIGHT: "Todos os direitos reservados.",
    CONTACT_RESPONSE_TIME: "Resposta em 24h",
    SEO_TITLE: "{APP_NAME} | Marketplace automóvel",
    SEO_DESCRIPTION: "Compra e venda de veículos com serviços completos e apoio dedicado."
  },
  COMPANY: {
    LOCATION: "Cidade, País",
    EMAIL: "contacto@exemplo.pt",
    PHONE: "+351 000 000 000"
  }
} as const;

export type AppConfig = typeof appConfig;
