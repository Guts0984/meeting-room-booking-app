import type { Request, Response } from "express";
import { z } from "zod";
import {
  createUserSchema,
  emailSchema,
  passwordSchema,
} from "../users/users.schemas.ts";
import * as authService from "./auth.service.ts";

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export async function register(req: Request, res: Response): Promise<void> {
  const data = createUserSchema.parse(req.body);
  const result = await authService.register(data);
  res.status(201).json(result);
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = loginSchema.parse(req.body);
  const result = await authService.login(email, password);
  res.json(result);
}

export async function me(_req: Request, res: Response): Promise<void> {
  const user = await authService.getCurrentUser(res.locals.userId as string);
  res.json(user);
}
