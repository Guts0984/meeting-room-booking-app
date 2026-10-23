import type { Request, Response } from "express";
import { z } from "zod";
import { createUserSchema, updateUserSchema } from "./users.schemas.ts";
import * as usersService from "./users.service.ts";

const userIdSchema = z.uuid();

export async function list(_req: Request, res: Response): Promise<void> {
  const users = await usersService.listUsers();
  res.json(users);
}

export async function getById(req: Request, res: Response): Promise<void> {
  const id = userIdSchema.parse(req.params.id);
  const user = await usersService.getUserById(id);
  res.json(user);
}

export async function create(req: Request, res: Response): Promise<void> {
  const data = createUserSchema.parse(req.body);
  const user = await usersService.createUser(data);
  res.status(201).json(user);
}

export async function update(req: Request, res: Response): Promise<void> {
  const id = userIdSchema.parse(req.params.id);
  const data = updateUserSchema.parse(req.body);
  const user = await usersService.updateUser(id, data);
  res.json(user);
}

export async function remove(req: Request, res: Response): Promise<void> {
  const id = userIdSchema.parse(req.params.id);
  await usersService.deleteUser(id);
  res.status(204).send();
}
