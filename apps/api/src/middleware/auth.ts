import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt";

export type AuthUser = {
  id: string;
  role: string;
};

export type AuthedRequest = Request & { user?: AuthUser };

export const requireAuth = (req: AuthedRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const token = header.replace("Bearer ", "");
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role };
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
