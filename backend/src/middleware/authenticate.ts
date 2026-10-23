import type { NextFunction, Request, Response } from "express";
import { appError } from "../utils/app-error.ts";
import { verifyAccessToken } from "../utils/jwt.ts";

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const match = /^Bearer\s+(\S+)$/i.exec(req.get("authorization") ?? "");
  const token = match?.[1];

  if (!token) {
    throw appError(401, "Missing or malformed bearer token");
  }

  let userId: string;
  try {
    userId = await verifyAccessToken(token);
  } catch {
    throw appError(401, "Invalid or expired token");
  }

  res.locals.userId = userId;
  next();
}
