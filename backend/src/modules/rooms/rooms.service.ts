import { prisma } from "../../db/index.ts";
import { Prisma, type RoomRole } from "../../generated/prisma/client.ts";
import { appError } from "../../utils/app-error.ts";

const memberUserSelect = {
  id: true,
  email: true,
  name: true,
} satisfies Prisma.UserSelect;

const roomWithMembersInclude = {
  members: {
    include: { user: { select: memberUserSelect } },
    orderBy: { createdAt: "asc" },
  },
} satisfies Prisma.RoomInclude;

export type CreateRoomInput = {
  name: string;
  description?: string | null | undefined;
};
export type UpdateRoomInput = {
  name?: string | undefined;
  description?: string | null | undefined;
};

export async function listRooms(userId: string) {
  const memberships = await prisma.roomMember.findMany({
    where: { userId },
    include: { room: true },
    orderBy: { room: { createdAt: "desc" } },
  });

  return memberships.map((membership) => ({
    ...membership.room,
    role: membership.role,
  }));
}

export async function getRoomById(roomId: string) {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: roomWithMembersInclude,
  });
  if (!room) {
    throw appError(404, "Room not found");
  }
  return room;
}

export async function createRoom(userId: string, data: CreateRoomInput) {
  return prisma.room.create({
    data: {
      name: data.name,
      description: data.description,
      createdById: userId,
      members: {
        create: { userId, role: "ADMIN" },
      },
    },
    include: roomWithMembersInclude,
  });
}

export async function updateRoom(roomId: string, data: UpdateRoomInput) {
  return prisma.room.update({
    where: { id: roomId },
    data,
    include: roomWithMembersInclude,
  });
}

export async function deleteRoom(roomId: string): Promise<void> {
  await prisma.room.delete({ where: { id: roomId } });
}

export async function listMembers(roomId: string) {
  return prisma.roomMember.findMany({
    where: { roomId },
    include: { user: { select: memberUserSelect } },
    orderBy: { createdAt: "asc" },
  });
}

export async function addMember(
  roomId: string,
  email: string,
  role: "admin" | "user",
) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw appError(404, "User not found");
  }

  try {
    return await prisma.roomMember.create({
      data: {
        roomId,
        userId: user.id,
        role: role.toUpperCase() as RoomRole,
      },
      include: { user: { select: memberUserSelect } },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw appError(409, "User is already a member");
    }
    throw error;
  }
}

export async function removeMember(
  roomId: string,
  userId: string,
): Promise<void> {
  const member = await prisma.roomMember.findUnique({
    where: { roomId_userId: { roomId, userId } },
  });
  if (!member) {
    throw appError(404, "Member not found");
  }

  if (member.role === "ADMIN") {
    const adminCount = await prisma.roomMember.count({
      where: { roomId, role: "ADMIN" },
    });
    if (adminCount <= 1) {
      throw appError(409, "Cannot remove the last room admin");
    }
  }

  await prisma.roomMember.delete({
    where: { roomId_userId: { roomId, userId } },
  });
}
