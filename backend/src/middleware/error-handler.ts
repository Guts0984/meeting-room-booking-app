import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { isAppError } from "../utils/app-error.ts";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (isAppError(err)) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({ error: "Validation failed", details: err.issues });
    return;
  }

  console.error(err);
  res.status(500).json({ error: "Internal server error" });
}
