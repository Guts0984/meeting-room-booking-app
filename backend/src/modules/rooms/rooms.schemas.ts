import { z } from "zod";
import { emailSchema } from "../users/users.schemas.ts";

export const createRoomSchema = z.object({
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).nullable().optional(),
});

export const updateRoomSchema = z
  .object({
    name: z.string().trim().min(1).max(200),
    description: z.string().trim().max(2000).nullable(),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const addMemberSchema = z.object({
  email: emailSchema,
  role: z.enum(["admin", "user"]),
});
