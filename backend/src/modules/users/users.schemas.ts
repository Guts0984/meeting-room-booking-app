import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email());

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .refine((password) => Buffer.byteLength(password, "utf8") <= 72, {
    message: "Password must be at most 72 UTF-8 bytes",
  });

const nameSchema = z.string().trim().min(1).max(100);

export const createUserSchema = z.object({
  email: emailSchema,
  name: nameSchema,
  password: passwordSchema,
});

export const updateUserSchema = z
  .object({
    email: emailSchema,
    name: nameSchema,
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });
