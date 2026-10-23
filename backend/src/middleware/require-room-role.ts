import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../db/index.ts";
import { type RoomRole } from "../generated/prisma/client.ts";
import { appError } from "../utils/app-error.ts";

export function requireRoomRole(...roles: RoomRole[]) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const roomId = req.params.roomId ?? req.params.id;
    const userId = res.locals.userId as string;

    const parsedRoomId = z.uuid().safeParse(roomId);
    if (!parsedRoomId.success) {
      throw appError(404, "Room not found");
    }

    const membership = await prisma.roomMember.findUnique({
      where: {
        roomId_userId: { roomId: parsedRoomId.data, userId },
      },
    });

    if (!membership) {
      throw appError(404, "Room not found");
    }

    if (!roles.includes(membership.role)) {
      throw appError(403, "Forbidden");
    }

    res.locals.roomId = membership.roomId;
    res.locals.roomRole = membership.role;
    next();
  };
}
