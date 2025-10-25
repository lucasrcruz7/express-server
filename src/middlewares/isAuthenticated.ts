import type { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface Payload {
  sub: string;
}

export function isAuthenticated(req: any, res: Response, next: NextFunction) {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).end();
  }

  const [, token] = authToken.split(" ");

  // Valida se a variável de ambiente está definida 
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET não está definido");
  }

  try {
    const value = verify(token, secret) as Payload;

    // Você pode salvar o payload no req se precisar depois
    req.user = value;

    next();
  } catch (err) {
    res.status(401).end();
  }
}
