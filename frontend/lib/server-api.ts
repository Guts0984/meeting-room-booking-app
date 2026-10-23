import { cookies } from "next/headers";
import { API_URL } from "@/lib/api";
import { AUTH_COOKIE } from "@/features/auth/session";

export async function apiFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  return fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
    cache: "no-store",
  });
}
