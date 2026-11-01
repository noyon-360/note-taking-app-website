import { cookies } from "next/headers";

import type { User } from "@/lib/types";

export const TOKEN_COOKIE = "session_token";
export const USER_COOKIE = "session_user";

const DEFAULT_MAX_AGE = 60 * 60;

export function parseUser(value: string | undefined): User | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as User;
  } catch {
    return null;
  }
}

export function backendUrl(path: string): string {
  const base = process.env.API_URL;
  if (!base) throw new Error("API_URL is not set");
  return `${base.replace(/\/$/, "")}${path}`;
}

function tokenMaxAge(token: string): number {
  try {
    const payload = token.split(".")[1];
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    return Math.max(exp - Math.floor(Date.now() / 1000), 0);
  } catch {
    return DEFAULT_MAX_AGE;
  }
}

export async function saveSession(token: string, user: User) {
  const store = await cookies();
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: tokenMaxAge(token),
  } as const;

  store.set(TOKEN_COOKIE, token, options);
  // Used for navigation and page guards only. The backend still checks every request.
  store.set(USER_COOKIE, JSON.stringify(user), options);
}

export async function clearSession() {
  const store = await cookies();
  store.delete(TOKEN_COOKIE);
  store.delete(USER_COOKIE);
}
