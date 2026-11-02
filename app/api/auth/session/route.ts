import { cookies } from "next/headers";

import { backendUrl, parseUser, saveSession, TOKEN_COOKIE, USER_COOKIE } from "@/lib/session";

export async function GET() {
  const store = await cookies();
  const user = store.has(TOKEN_COOKIE)
    ? parseUser(store.get(USER_COOKIE)?.value)
    : null;
  return Response.json({ success: true, data: user });
}

// The user comes from the API, never the browser: this cookie guards the admin pages.
export async function POST() {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;

  let response: globalThis.Response;
  try {
    response = await fetch(backendUrl("/users"), {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
  } catch {
    return Response.json(
      { success: false, message: "Could not reach the API" },
      { status: 502 },
    );
  }

  const json = await response.json().catch(() => null);
  if (!token || !response.ok || !json?.data) {
    return Response.json(
      json ?? { success: false, message: "The API returned an invalid response" },
      { status: response.ok ? 502 : response.status },
    );
  }

  await saveSession(token, json.data);
  return Response.json({ success: true, data: json.data });
}
