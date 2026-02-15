const apiBase = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const apiOrigin = apiBase.replace(/\/api\/?$/, "");

export const resolveMediaUrl = (path: string) => {
  if (!path) return path;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  if (path.startsWith("/uploads")) {
    return `${apiOrigin}${path}`;
  }
  if (path.startsWith("uploads")) {
    return `${apiOrigin}/${path}`;
  }
  return path;
};
