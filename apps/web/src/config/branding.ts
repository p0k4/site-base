import { appConfig } from "./appConfig";

const WHITE = { r: 255, g: 255, b: 255 };
const BLACK = { r: 0, g: 0, b: 0 };

type Rgb = { r: number; g: number; b: number };

type ColorScale = {
  50: Rgb;
  100: Rgb;
  200: Rgb;
  300: Rgb;
  400: Rgb;
  500: Rgb;
  600: Rgb;
  700: Rgb;
  800: Rgb;
  900: Rgb;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const hexToRgb = (value: string, fallback: Rgb): Rgb => {
  if (!value) return fallback;
  const sanitized = value.replace("#", "").trim();
  if (![3, 6].includes(sanitized.length)) return fallback;
  const hex = sanitized.length === 3
    ? sanitized.split("").map((char) => char + char).join("")
    : sanitized;
  const number = Number.parseInt(hex, 16);
  if (Number.isNaN(number)) return fallback;
  return {
    r: (number >> 16) & 255,
    g: (number >> 8) & 255,
    b: number & 255
  };
};

const mix = (base: Rgb, target: Rgb, weight: number): Rgb => ({
  r: Math.round(base.r * (1 - weight) + target.r * weight),
  g: Math.round(base.g * (1 - weight) + target.g * weight),
  b: Math.round(base.b * (1 - weight) + target.b * weight)
});

const buildScale = (hex: string, fallback: Rgb): ColorScale => {
  const base = hexToRgb(hex, fallback);
  return {
    50: mix(base, WHITE, 0.9),
    100: mix(base, WHITE, 0.82),
    200: mix(base, WHITE, 0.7),
    300: mix(base, WHITE, 0.58),
    400: mix(base, WHITE, 0.44),
    500: base,
    600: mix(base, BLACK, 0.12),
    700: mix(base, BLACK, 0.25),
    800: mix(base, BLACK, 0.38),
    900: mix(base, BLACK, 0.52)
  };
};

const toCssValue = (rgb: Rgb) => `${clamp(rgb.r, 0, 255)} ${clamp(rgb.g, 0, 255)} ${clamp(rgb.b, 0, 255)}`;

const setScaleVars = (root: HTMLElement, prefix: string, scale: ColorScale, keys: (keyof ColorScale)[]) => {
  keys.forEach((key) => {
    root.style.setProperty(`--${prefix}-${key}`, toCssValue(scale[key]));
  });
};

const ensureMeta = (selector: string, attributes: Record<string, string>) => {
  if (typeof document === "undefined") return null;
  let tag = document.querySelector(selector) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    Object.entries(attributes).forEach(([name, value]) => tag!.setAttribute(name, value));
    document.head.appendChild(tag);
  }
  return tag;
};

const setMetaContent = (selector: string, attributes: Record<string, string>, content: string) => {
  const tag = ensureMeta(selector, attributes);
  if (tag) tag.content = content;
};

const normalizeUrl = (domain: string) => {
  const value = domain.trim();
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }
  return `https://${value}`;
};

export const formatBrandText = (value: string) => value.replace(/\{APP_NAME\}/g, appConfig.APP_NAME);

export const brandText = {
  heroTitle: formatBrandText(appConfig.TEXTS.HERO_TITLE),
  heroSubtitle: formatBrandText(appConfig.TEXTS.HERO_SUBTITLE),
  tagline: formatBrandText(appConfig.TEXTS.TAGLINE),
  adminSectionTitle: formatBrandText(appConfig.TEXTS.ADMIN_SECTION_TITLE),
  footerCopyright: formatBrandText(appConfig.TEXTS.FOOTER_COPYRIGHT),
  contactResponseTime: formatBrandText(appConfig.TEXTS.CONTACT_RESPONSE_TIME),
  seoTitle: formatBrandText(appConfig.TEXTS.SEO_TITLE),
  seoDescription: formatBrandText(appConfig.TEXTS.SEO_DESCRIPTION)
};

export const applyBranding = () => {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  const brandFallback = { r: 184, g: 147, b: 99 };
  const accentFallback = { r: 199, g: 161, b: 122 };
  const brandScale = buildScale(appConfig.PRIMARY_COLOR, brandFallback);
  const accentScale = buildScale(appConfig.SECONDARY_COLOR, accentFallback);
  const brandKeys: Array<keyof ColorScale> = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
  const accentKeys: Array<keyof ColorScale> = [50, 100, 200, 300, 400];

  setScaleVars(root, "brand", brandScale, brandKeys);
  setScaleVars(root, "accent", accentScale, accentKeys);

  root.style.setProperty("--brand-primary", appConfig.PRIMARY_COLOR);
  root.style.setProperty("--brand-secondary", appConfig.SECONDARY_COLOR);

  document.title = brandText.seoTitle;
  setMetaContent("meta[name='description']", { name: "description" }, brandText.seoDescription);
  setMetaContent("meta[property='og:title']", { property: "og:title" }, brandText.seoTitle);
  setMetaContent("meta[property='og:description']", { property: "og:description" }, brandText.seoDescription);
  setMetaContent("meta[name='twitter:title']", { name: "twitter:title" }, brandText.seoTitle);
  setMetaContent("meta[name='twitter:description']", { name: "twitter:description" }, brandText.seoDescription);
  setMetaContent("meta[name='theme-color']", { name: "theme-color" }, appConfig.PRIMARY_COLOR);

  const siteUrl = normalizeUrl(appConfig.DOMAIN);
  if (siteUrl) {
    setMetaContent("meta[property='og:url']", { property: "og:url" }, siteUrl);
    setMetaContent("meta[name='twitter:url']", { name: "twitter:url" }, siteUrl);
    let canonical = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = siteUrl;
  }

  if (appConfig.BRAND_FAVICON_PATH) {
    let favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
    if (!favicon) {
      favicon = document.createElement("link");
      favicon.rel = "icon";
      document.head.appendChild(favicon);
    }
    favicon.href = appConfig.BRAND_FAVICON_PATH;
  }
};
