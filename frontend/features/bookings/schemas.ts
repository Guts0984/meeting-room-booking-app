import { z } from "zod";

export const bookingSchema = z
  .object({
    description: z
      .string()
      .trim()
      .max(500, "Description must be at most 500 characters")
      .optional(),
    start: z.string().min(1, "Start time is required"),
    end: z.string().min(1, "End time is required"),
  })
  .refine((values) => new Date(values.end) > new Date(values.start), {
    message: "End time must be after start time",
    path: ["end"],
  });

export type BookingValues = z.infer<typeof bookingSchema>;
