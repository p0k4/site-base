import fs from "fs";
import path from "path";

export const ensureDir = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

export const safeJoin = (...parts: string[]) =>
  path.normalize(path.join(...parts));
