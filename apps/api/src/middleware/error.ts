import { NextFunction, Request, Response } from "express";
import multer from "multer";

export const notFound = (_req: Request, res: Response) =>
  res.status(404).json({ message: "Rota nao encontrada." });

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  // eslint-disable-next-line no-console
  console.error(err);
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "Imagem demasiado grande (max 5MB)." });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({ message: "Maximo de 12 imagens por anuncio." });
    }
    return res.status(400).json({ message: "Erro no upload de imagens." });
  }
  if (err.message.includes("Tipo de ficheiro")) {
    return res.status(400).json({ message: err.message });
  }
  return res.status(500).json({ message: "Algo correu mal. Tente novamente." });
};
