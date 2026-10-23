import { z } from "zod";

const dateTimeSchema = z.iso
  .datetime()
  .transform((value) => new Date(value));

export const createBookingSchema = z
  .object({
    description: z.string().trim().max(2000).nullable().optional(),
    startTime: dateTimeSchema,
    endTime: dateTimeSchema,
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "endTime must be after startTime",
  })
  .refine((data) => data.startTime.getTime() >= Date.now() - 60_000, {
    message: "startTime must not be in the past",
  });

export const updateBookingSchema = z
  .object({
    description: z.string().trim().max(2000).nullable(),
    startTime: dateTimeSchema,
    endTime: dateTimeSchema,
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  })
  .refine(
    (data) =>
      data.startTime === undefined ||
      data.startTime.getTime() >= Date.now() - 60_000,
    { message: "startTime must not be in the past" },
  );

export const listBookingsQuerySchema = z
  .object({
    from: z.iso.datetime().optional(),
    to: z.iso.datetime().optional(),
  })
  .refine(
    (data) =>
      data.from === undefined ||
      data.to === undefined ||
      new Date(data.from) < new Date(data.to),
    { message: "from must be before to" },
  );
