import type { Request, Response } from "express";
import { z } from "zod";
import {
  addMemberSchema,
  createRoomSchema,
  updateRoomSchema,
} from "./rooms.schemas.ts";
import * as roomsService from "./rooms.service.ts";

const roomIdSchema = z.uuid();
const userIdSchema = z.uuid();

export async function list(req: Request, res: Response): Promise<void> {
  const rooms = await roomsService.listRooms(res.locals.userId as string);
  res.json(rooms);
}

export async function getById(req: Request, res: Response): Promise<void> {
  const room = await roomsService.getRoomById(res.locals.roomId as string);
  res.json(room);
}

export async function create(req: Request, res: Response): Promise<void> {
  const data = createRoomSchema.parse(req.body);
  const room = await roomsService.createRoom(res.locals.userId as string, data);
  res.status(201).json(room);
}

export async function update(req: Request, res: Response): Promise<void> {
  const data = updateRoomSchema.parse(req.body);
  const room = await roomsService.updateRoom(
    res.locals.roomId as string,
    data,
  );
  res.json(room);
}

export async function remove(req: Request, res: Response): Promise<void> {
  await roomsService.deleteRoom(res.locals.roomId as string);
  res.status(204).send();
}

export async function listMembers(req: Request, res: Response): Promise<void> {
  const members = await roomsService.listMembers(res.locals.roomId as string);
  res.json(members);
}

export async function addMember(req: Request, res: Response): Promise<void> {
  const roomId = roomIdSchema.parse(req.params.id);
  const { email, role } = addMemberSchema.parse(req.body);
  const member = await roomsService.addMember(roomId, email, role);
  res.status(201).json(member);
}

export async function removeMember(
  req: Request,
  res: Response,
): Promise<void> {
  const roomId = roomIdSchema.parse(req.params.id);
  const userId = userIdSchema.parse(req.params.userId);
  await roomsService.removeMember(roomId, userId);
  res.status(204).send();
}
