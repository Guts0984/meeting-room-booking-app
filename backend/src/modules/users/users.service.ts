import bcrypt from "bcryptjs";
import { prisma } from "../../db/index.ts";
import { Prisma, type User } from "../../generated/prisma/client.ts";
import { appError } from "../../utils/app-error.ts";

export const publicUserSelect = {
  id: true,
  email: true,
  name: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export type PublicUser = Pick<
  User,
  "id" | "email" | "name" | "createdAt" | "updatedAt"
>;
export type CreateUserInput = Pick<User, "email" | "name"> & {
  password: string;
};
export type UpdateUserInput = Partial<Pick<User, "email" | "name">>;

function isUniqueViolation(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

function isRecordNotFound(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  );
}

export async function listUsers(): Promise<PublicUser[]> {
  return prisma.user.findMany({ select: publicUserSelect });
}

export async function getUserById(id: string): Promise<PublicUser> {
  const user = await prisma.user.findUnique({
    where: { id },
    select: publicUserSelect,
  });
  if (!user) {
    throw appError(404, "User not found");
  }
  return user;
}

export async function createUser(data: CreateUserInput): Promise<PublicUser> {
  const passwordHash = await bcrypt.hash(data.password, 12);

  try {
    return await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash,
      },
      select: publicUserSelect,
    });
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw appError(409, "Email already in use");
    }
    throw error;
  }
}

export async function updateUser(
  id: string,
  data: UpdateUserInput,
): Promise<PublicUser> {
  try {
    return await prisma.user.update({
      where: { id },
      data,
      select: publicUserSelect,
    });
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw appError(409, "Email already in use");
    }
    if (isRecordNotFound(error)) {
      throw appError(404, "User not found");
    }
    throw error;
  }
}

export async function deleteUser(id: string): Promise<void> {
  try {
    await prisma.user.delete({ where: { id } });
  } catch (error) {
    if (isRecordNotFound(error)) {
      throw appError(404, "User not found");
    }
    throw error;
  }
}
