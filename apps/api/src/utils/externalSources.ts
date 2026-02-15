const allowedStandvirtualHosts = new Set([
  "standvirtual.com",
  "www.standvirtual.com",
  "standvirtual.pt",
  "www.standvirtual.pt",
  "m.standvirtual.com",
  "m.standvirtual.pt"
]);

const hasScheme = (value: string) => /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(value);

export const normalizeStandvirtualUrl = (raw: string) => {
  const value = raw.trim();
  const candidate = hasScheme(value) ? value : `https://${value}`;
  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    throw new Error("Link do Standvirtual invalido.");
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Link do Standvirtual invalido.");
  }

  if (url.username || url.password) {
    throw new Error("Link do Standvirtual invalido.");
  }

  const hostname = url.hostname.toLowerCase();
  if (!allowedStandvirtualHosts.has(hostname)) {
    throw new Error("Link do Standvirtual nao permitido.");
  }

  url.protocol = "https:";
  url.hostname = hostname;
  url.hash = "";

  if ((url.protocol === "https:" && url.port === "443") || (url.protocol === "http:" && url.port === "80")) {
    url.port = "";
  }

  if (url.pathname !== "/") {
    url.pathname = url.pathname.replace(/\/+$/, "");
  }

  return url.toString();
};

export const isStandvirtualUrl = (raw: string) => {
  try {
    normalizeStandvirtualUrl(raw);
    return true;
  } catch {
    return false;
  }
};

export const getStandvirtualSourceName = () => "Standvirtual";
