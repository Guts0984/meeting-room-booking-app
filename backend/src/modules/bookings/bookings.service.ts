import { prisma } from "../../db/index.ts";
import { Prisma } from "../../generated/prisma/client.ts";
import { appError } from "../../utils/app-error.ts";

const bookingUserSelect = {
  id: true,
  email: true,
  name: true,
} satisfies Prisma.UserSelect;

const bookingInclude = {
  createdBy: { select: bookingUserSelect },
  attendees: {
    include: { user: { select: bookingUserSelect } },
    orderBy: { createdAt: "asc" },
  },
} satisfies Prisma.BookingInclude;

export type CreateBookingInput = {
  description?: string | null | undefined;
  startTime: Date;
  endTime: Date;
};
export type UpdateBookingInput = Partial<CreateBookingInput>;
export type ListBookingsFilter = {
  from?: string | undefined;
  to?: string | undefined;
};

async function assertNoConflict(
  roomId: string,
  startTime: Date,
  endTime: Date,
  excludeBookingId?: string,
): Promise<void> {
  const conflict = await prisma.booking.findFirst({
    where: {
      roomId,
      ...(excludeBookingId ? { id: { not: excludeBookingId } } : {}),
      startTime: { lt: endTime },
      endTime: { gt: startTime },
    },
    select: { id: true },
  });

  if (conflict) {
    throw appError(409, "Booking conflicts with an existing booking");
  }
}

async function getBookingForMember(userId: string, bookingId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: bookingInclude,
  });
  if (!booking) {
    throw appError(404, "Booking not found");
  }

  const membership = await prisma.roomMember.findUnique({
    where: { roomId_userId: { roomId: booking.roomId, userId } },
  });
  if (!membership) {
    throw appError(404, "Booking not found");
  }

  return { booking, membership };
}

async function getBookingForAdmin(userId: string, bookingId: string) {
  const result = await getBookingForMember(userId, bookingId);
  if (result.membership.role !== "ADMIN") {
    throw appError(403, "Forbidden");
  }
  return result;
}

export async function createBooking(
  userId: string,
  roomId: string,
  data: CreateBookingInput,
) {
  await assertNoConflict(roomId, data.startTime, data.endTime);

  return prisma.booking.create({
    data: {
      roomId,
      createdById: userId,
      description: data.description,
      startTime: data.startTime,
      endTime: data.endTime,
      attendees: {
        create: { userId },
      },
    },
    include: bookingInclude,
  });
}

export async function listBookings(
  roomId: string,
  filter: ListBookingsFilter,
) {
  const from = filter.from ? new Date(filter.from) : undefined;
  const to = filter.to ? new Date(filter.to) : undefined;

  return prisma.booking.findMany({
    where: {
      roomId,
      ...(from ? { endTime: { gt: from } } : {}),
      ...(to ? { startTime: { lt: to } } : {}),
    },
    orderBy: { startTime: "asc" },
    include: bookingInclude,
  });
}

export async function getBookingById(userId: string, bookingId: string) {
  const { booking } = await getBookingForMember(userId, bookingId);
  return booking;
}

export async function updateBooking(
  userId: string,
  bookingId: string,
  data: UpdateBookingInput,
) {
  const { booking } = await getBookingForAdmin(userId, bookingId);

  const startTime = data.startTime ?? booking.startTime;
  const endTime = data.endTime ?? booking.endTime;

  if (data.startTime !== undefined || data.endTime !== undefined) {
    if (endTime <= startTime) {
      throw appError(400, "endTime must be after startTime");
    }
    await assertNoConflict(booking.roomId, startTime, endTime, bookingId);
  }

  return prisma.booking.update({
    where: { id: bookingId },
    data,
    include: bookingInclude,
  });
}

export async function deleteBooking(
  userId: string,
  bookingId: string,
): Promise<void> {
  await getBookingForAdmin(userId, bookingId);
  await prisma.booking.delete({ where: { id: bookingId } });
}

export async function joinBooking(userId: string, bookingId: string) {
  await getBookingForMember(userId, bookingId);

  try {
    return await prisma.bookingAttendee.create({
      data: { bookingId, userId },
      include: { user: { select: bookingUserSelect } },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw appError(409, "Already joined this booking");
    }
    throw error;
  }
}

export async function leaveBooking(
  userId: string,
  bookingId: string,
): Promise<void> {
  const { booking } = await getBookingForMember(userId, bookingId);

  if (booking.createdById === userId) {
    throw appError(409, "Booking creator cannot leave");
  }

  const attendee = await prisma.bookingAttendee.findUnique({
    where: { bookingId_userId: { bookingId, userId } },
  });
  if (!attendee) {
    throw appError(404, "Not an attendee");
  }

  await prisma.bookingAttendee.delete({
    where: { bookingId_userId: { bookingId, userId } },
  });
}
