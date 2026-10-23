import type { Request, Response } from "express";
import { z } from "zod";
import {
  createBookingSchema,
  listBookingsQuerySchema,
  updateBookingSchema,
} from "./bookings.schemas.ts";
import * as bookingsService from "./bookings.service.ts";

const bookingIdSchema = z.uuid();

export async function listForRoom(
  req: Request,
  res: Response,
): Promise<void> {
  const filter = listBookingsQuerySchema.parse(req.query);
  const bookings = await bookingsService.listBookings(
    res.locals.roomId as string,
    filter,
  );
  res.json(bookings);
}

export async function createForRoom(
  req: Request,
  res: Response,
): Promise<void> {
  const data = createBookingSchema.parse(req.body);
  const booking = await bookingsService.createBooking(
    res.locals.userId as string,
    res.locals.roomId as string,
    data,
  );
  res.status(201).json(booking);
}

export async function getById(req: Request, res: Response): Promise<void> {
  const id = bookingIdSchema.parse(req.params.id);
  const booking = await bookingsService.getBookingById(
    res.locals.userId as string,
    id,
  );
  res.json(booking);
}

export async function update(req: Request, res: Response): Promise<void> {
  const id = bookingIdSchema.parse(req.params.id);
  const data = updateBookingSchema.parse(req.body);
  const booking = await bookingsService.updateBooking(
    res.locals.userId as string,
    id,
    data,
  );
  res.json(booking);
}

export async function remove(req: Request, res: Response): Promise<void> {
  const id = bookingIdSchema.parse(req.params.id);
  await bookingsService.deleteBooking(res.locals.userId as string, id);
  res.status(204).send();
}

export async function join(req: Request, res: Response): Promise<void> {
  const id = bookingIdSchema.parse(req.params.id);
  const attendee = await bookingsService.joinBooking(
    res.locals.userId as string,
    id,
  );
  res.status(201).json(attendee);
}

export async function leave(req: Request, res: Response): Promise<void> {
  const id = bookingIdSchema.parse(req.params.id);
  await bookingsService.leaveBooking(res.locals.userId as string, id);
  res.status(204).send();
}
