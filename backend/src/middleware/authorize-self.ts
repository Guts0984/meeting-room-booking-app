import type { NextFunction, Request, Response } from "express";
import { appError } from "../utils/app-error.ts";

export function authorizeSelf(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (req.params.id !== res.locals.userId) {
    throw appError(403, "Forbidden");
  }

  next();
}
