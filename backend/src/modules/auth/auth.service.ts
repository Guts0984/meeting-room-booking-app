import bcrypt from "bcryptjs";
import { prisma } from "../../db/index.ts";
import { appError } from "../../utils/app-error.ts";
import { signAccessToken } from "../../utils/jwt.ts";
import {
  createUser,
  getUserById,
  type CreateUserInput,
  type PublicUser,
} from "../users/users.service.ts";

const dummyPasswordHash =
  "$2b$12$XkZntswuOpDDRYrSkjkQxeEm6Z9wJGXJGY2TmuuhufF7cYG..F4li";

type AuthResult = {
  user: PublicUser;
  accessToken: string;
};

export async function register(data: CreateUserInput): Promise<AuthResult> {
  const user = await createUser(data);
  const accessToken = await signAccessToken(user.id);
  return { user, accessToken };
}

export async function login(
  email: string,
  password: string,
): Promise<AuthResult> {
  const user = await prisma.user.findUnique({ where: { email } });

  const passwordMatches = await bcrypt.compare(
    password,
    user?.passwordHash ?? dummyPasswordHash,
  );

  if (!user?.passwordHash || !passwordMatches) {
    throw appError(401, "Invalid credentials");
  }

  const accessToken = await signAccessToken(user.id);
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    accessToken,
  };
}

export async function getCurrentUser(userId: string): Promise<PublicUser> {
  return getUserById(userId);
}
