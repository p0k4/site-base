import { NextFunction, Response } from "express";
import { AuthedRequest } from "./auth";

export const requireAdmin = (req: AuthedRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  return next();
};
