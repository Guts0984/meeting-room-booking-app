"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/server-api";
import { bookingSchema, type BookingValues } from "./schemas";

type ActionError = { error: string };

async function parseError(res: Response): Promise<ActionError> {
  const data = (await res.json().catch(() => null)) as {
    error?: string;
  } | null;
  return { error: data?.error ?? "Something went wrong. Please try again." };
}

function toBody(values: BookingValues) {
  return {
    description: values.description || undefined,
    startTime: new Date(values.start).toISOString(),
    endTime: new Date(values.end).toISOString(),
  };
}

export async function createBookingAction(
  roomId: string,
  values: BookingValues,
): Promise<ActionError | undefined> {
  const parsed = bookingSchema.safeParse(values);
  if (!parsed.success) return { error: "Invalid form data" };

  let res: Response;
  try {
    res = await apiFetch(`/api/rooms/${roomId}/bookings`, {
      method: "POST",
      body: JSON.stringify(toBody(parsed.data)),
    });
  } catch {
    return { error: "Could not reach the server. Please try again." };
  }

  if (!res.ok) return parseError(res);

  revalidatePath(`/rooms/${roomId}`);
}

export async function updateBookingAction(
  roomId: string,
  bookingId: string,
  values: BookingValues,
): Promise<ActionError | undefined> {
  const parsed = bookingSchema.safeParse(values);
  if (!parsed.success) return { error: "Invalid form data" };

  let res: Response;
  try {
    res = await apiFetch(`/api/bookings/${bookingId}`, {
      method: "PATCH",
      body: JSON.stringify(toBody(parsed.data)),
    });
  } catch {
    return { error: "Could not reach the server. Please try again." };
  }

  if (!res.ok) return parseError(res);

  revalidatePath(`/rooms/${roomId}`);
}

export async function deleteBookingAction(
  roomId: string,
  bookingId: string,
): Promise<ActionError | undefined> {
  let res: Response;
  try {
    res = await apiFetch(`/api/bookings/${bookingId}`, { method: "DELETE" });
  } catch {
    return { error: "Could not reach the server. Please try again." };
  }

  if (!res.ok) return parseError(res);

  revalidatePath(`/rooms/${roomId}`);
}

export async function joinBookingAction(
  roomId: string,
  bookingId: string,
): Promise<ActionError | undefined> {
  let res: Response;
  try {
    res = await apiFetch(`/api/bookings/${bookingId}/join`, {
      method: "POST",
    });
  } catch {
    return { error: "Could not reach the server. Please try again." };
  }

  if (!res.ok) return parseError(res);

  revalidatePath(`/rooms/${roomId}`);
}

export async function leaveBookingAction(
  roomId: string,
  bookingId: string,
): Promise<ActionError | undefined> {
  let res: Response;
  try {
    res = await apiFetch(`/api/bookings/${bookingId}/leave`, {
      method: "DELETE",
    });
  } catch {
    return { error: "Could not reach the server. Please try again." };
  }

  if (!res.ok) return parseError(res);

  revalidatePath(`/rooms/${roomId}`);
}
