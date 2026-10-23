import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email("Enter a valid email address"));

export const roomSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters"),
  description: z
    .string()
    .trim()
    .max(500, "Description must be at most 500 characters")
    .optional(),
});

export const addMemberSchema = z.object({
  email: emailSchema,
  role: z.enum(["admin", "user"]),
});

export type RoomValues = z.infer<typeof roomSchema>;
export type AddMemberValues = z.infer<typeof addMemberSchema>;
