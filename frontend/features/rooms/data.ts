import { apiFetch } from "@/lib/server-api";
import type { RoomListItem, RoomWithMembers } from "./types";

export async function getRooms(): Promise<RoomListItem[]> {
  try {
    const res = await apiFetch("/api/rooms");
    if (!res.ok) return [];
    return (await res.json()) as RoomListItem[];
  } catch {
    return [];
  }
}

export async function getRoom(id: string): Promise<RoomWithMembers | null> {
  try {
    const res = await apiFetch(`/api/rooms/${id}`);
    if (!res.ok) return null;
    return (await res.json()) as RoomWithMembers;
  } catch {
    return null;
  }
}
