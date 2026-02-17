const hasScheme = (value: string) => /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(value);

export const normalizeExternalUrl = (raw: string) => {
  const value = raw.trim();
  const candidate = hasScheme(value) ? value : `https://${value}`;
  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    throw new Error("Link externo invalido.");
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Link externo invalido.");
  }

  if (url.username || url.password) {
    throw new Error("Link externo invalido.");
  }

  url.protocol = "https:";
  url.hostname = url.hostname.toLowerCase();
  url.hash = "";

  if ((url.protocol === "https:" && url.port === "443") || (url.protocol === "http:" && url.port === "80")) {
    url.port = "";
  }

  if (url.pathname !== "/") {
    url.pathname = url.pathname.replace(/\/+$/, "");
  }

  return url.toString();
};

export const isExternalUrl = (raw: string) => {
  try {
    normalizeExternalUrl(raw);
    return true;
  } catch {
    return false;
  }
};

export const getDefaultExternalSourceName = () => "Origem externa";
