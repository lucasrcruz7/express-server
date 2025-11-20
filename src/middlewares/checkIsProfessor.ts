import type { Request, Response, NextFunction }from "express";

export const checkProfessor = (req: any, res: Response, next: NextFunction) => {
  if (req.user?.role !== "professor") {
    return res.status(400).json({ message: "User is not professor" });
  }
  next();
};