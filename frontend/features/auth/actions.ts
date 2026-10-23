"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { API_URL } from "@/lib/api";
import { AUTH_COOKIE } from "./session";
import {
  loginSchema,
  registerSchema,
  type LoginValues,
  type RegisterValues,
} from "./schemas";

const TOKEN_MAX_AGE = 60 * 15;

type AuthError = { error: string };

async function authenticate(
  path: "login" | "register",
  body: unknown,
): Promise<AuthError | undefined> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/api/auth/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    return { error: "Could not reach the server. Please try again." };
  }

  const data = (await res.json().catch(() => null)) as {
    accessToken?: string;
    error?: string;
  } | null;

  if (!res.ok || !data?.accessToken) {
    return { error: data?.error ?? "Something went wrong. Please try again." };
  }

  const store = await cookies();
  store.set(AUTH_COOKIE, data.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TOKEN_MAX_AGE,
  });
}

export async function loginAction(
  values: LoginValues,
): Promise<AuthError | undefined> {
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) return { error: "Invalid form data" };

  const result = await authenticate("login", parsed.data);
  if (result) return result;

  redirect("/dashboard");
}

export async function registerAction(
  values: RegisterValues,
): Promise<AuthError | undefined> {
  const parsed = registerSchema.safeParse(values);
  if (!parsed.success) return { error: "Invalid form data" };

  const result = await authenticate("register", parsed.data);
  if (result) return result;

  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  const store = await cookies();
  store.delete(AUTH_COOKIE);
  redirect("/");
}
