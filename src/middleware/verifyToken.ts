// src/middlewares/verifyToken.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { SECRET_JWT_KEY } from "../config/config";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.access_token;

  if (!token) {
     res.status(401).json({ message: "Acceso denegado. Token faltante." });
  }

  try {
    const decoded = jwt.verify(token, SECRET_JWT_KEY) as { id: string; email: string };
    (req as any).user = decoded;
    next();
  } catch (err: any) {
    console.warn("Token inválido:", err.message);
     res.status(401).json({ message: "Token inválido." });
  }
};
