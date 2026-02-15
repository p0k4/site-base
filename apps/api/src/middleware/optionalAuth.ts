import { NextFunction, Response } from "express";
import { AuthedRequest } from "./auth";
import { verifyAccessToken } from "../utils/jwt";

export const optionalAuth = (req: AuthedRequest, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next();
  }

  try {
    const token = header.replace("Bearer ", "");
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role };
  } catch {
    // ignore
  }

  return next();
};
