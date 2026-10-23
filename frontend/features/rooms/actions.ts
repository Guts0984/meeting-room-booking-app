"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiFetch } from "@/lib/server-api";
import {
  addMemberSchema,
  roomSchema,
  type AddMemberValues,
  type RoomValues,
} from "./schemas";

type ActionError = { error: string };

async function parseError(res: Response): Promise<ActionError> {
  const data = (await res.json().catch(() => null)) as {
    error?: string;
  } | null;
  return { error: data?.error ?? "Something went wrong. Please try again." };
}

export async function createRoomAction(
  values: RoomValues,
): Promise<ActionError | undefined> {
  const parsed = roomSchema.safeParse(values);
  if (!parsed.success) return { error: "Invalid form data" };

  let res: Response;
  try {
    res = await apiFetch("/api/rooms", {
      method: "POST",
      body: JSON.stringify({
        name: parsed.data.name,
        description: parsed.data.description || undefined,
      }),
    });
  } catch {
    return { error: "Could not reach the server. Please try again." };
  }

  if (!res.ok) return parseError(res);

  revalidatePath("/dashboard");
}

export async function updateRoomAction(
  roomId: string,
  values: RoomValues,
): Promise<ActionError | undefined> {
  const parsed = roomSchema.safeParse(values);
  if (!parsed.success) return { error: "Invalid form data" };

  let res: Response;
  try {
    res = await apiFetch(`/api/rooms/${roomId}`, {
      method: "PATCH",
      body: JSON.stringify({
        name: parsed.data.name,
        description: parsed.data.description || undefined,
      }),
    });
  } catch {
    return { error: "Could not reach the server. Please try again." };
  }

  if (!res.ok) return parseError(res);

  revalidatePath("/dashboard");
  revalidatePath(`/rooms/${roomId}`);
}

export async function deleteRoomAction(
  roomId: string,
): Promise<ActionError | undefined> {
  let res: Response;
  try {
    res = await apiFetch(`/api/rooms/${roomId}`, { method: "DELETE" });
  } catch {
    return { error: "Could not reach the server. Please try again." };
  }

  if (!res.ok) return parseError(res);

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function addMemberAction(
  roomId: string,
  values: AddMemberValues,
): Promise<ActionError | undefined> {
  const parsed = addMemberSchema.safeParse(values);
  if (!parsed.success) return { error: "Invalid form data" };

  let res: Response;
  try {
    res = await apiFetch(`/api/rooms/${roomId}/members`, {
      method: "POST",
      body: JSON.stringify(parsed.data),
    });
  } catch {
    return { error: "Could not reach the server. Please try again." };
  }

  if (!res.ok) return parseError(res);

  revalidatePath(`/rooms/${roomId}`);
}

export async function removeMemberAction(
  roomId: string,
  userId: string,
): Promise<ActionError | undefined> {
  let res: Response;
  try {
    res = await apiFetch(`/api/rooms/${roomId}/members/${userId}`, {
      method: "DELETE",
    });
  } catch {
    return { error: "Could not reach the server. Please try again." };
  }

  if (!res.ok) return parseError(res);

  revalidatePath(`/rooms/${roomId}`);
}
