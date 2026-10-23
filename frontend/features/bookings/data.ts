import { apiFetch } from "@/lib/server-api";
import type { Booking } from "./types";

export async function getBookings(roomId: string): Promise<Booking[]> {
  try {
    const res = await apiFetch(`/api/rooms/${roomId}/bookings`);
    if (!res.ok) return [];
    return (await res.json()) as Booking[];
  } catch {
    return [];
  }
}
