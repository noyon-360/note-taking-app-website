import type { PageMeta, User } from "@/lib/types";

type Body = Record<string, unknown>;
type FieldError = { field: string; message: string };

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly notReady = false,
  ) {
    super(message);
  }
}

const NOT_READY = "This backend endpoint isn't finished yet.";

function validationMessage(errors: FieldError[]): string {
  return errors
    .map(({ field, message }) => {
      const text = message.replace(/^Value error, /, "");
      return field ? `${field}: ${text}` : text;
    })
    .join(". ");
}

async function send<T>(url: string, method: string, body?: Body) {
  const response = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await response.json().catch(() => null);

  // Unfinished routes answer 200 with no `success` flag, and missing routes
  // use FastAPI's default { detail } body rather than the app's error format.
  const stub = response.ok && json?.success !== true;
  const missing = [404, 405].includes(response.status) && json?.detail;
  if (stub || missing) throw new ApiError(NOT_READY, response.status, true);

  if (!response.ok) {
    const message = Array.isArray(json?.error)
      ? validationMessage(json.error)
      : json?.message;
    throw new ApiError(message ?? "Something went wrong", response.status);
  }
  return json as { data: T; metadata?: PageMeta };
}

export async function backend<T>(path: string, options: { method?: string; body?: Body } = {}) {
  try {
    return await send<T>(`/api/backend${path}`, options.method ?? "GET", options.body);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      // Full reload, like logout: the session is gone, so nothing may stay in memory.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign("/login");
    }
    throw error;
  }
}

export async function signIn(action: "login" | "register", body: Body) {
  const { data } = await send<User>(`/api/auth/${action}`, "POST", body);
  return data;
}
