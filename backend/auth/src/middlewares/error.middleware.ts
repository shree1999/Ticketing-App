import { Request, Response, NextFunction } from "express";
import { Base } from "../config/errors/Base";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof Base) {
    return res.status(err.statusCode).json(err.serializeError());
  }

  res.status(500).json({ success: false, message: err.message });
};
