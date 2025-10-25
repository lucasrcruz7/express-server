import { NextFunction, Request, Response } from "express";

export default function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {

  res.status(500).json({
    error: {
      message:
        "An error occurred. Please view logs for more details",
    },
  });
}