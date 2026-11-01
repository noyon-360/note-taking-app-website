import { backendUrl, saveSession } from "@/lib/session";

// Calls a backend auth route and keeps the JWT on the server, in a cookie.
export async function forwardAuth(path: string, request: Request) {
  let response: globalThis.Response;
  try {
    response = await fetch(backendUrl(path), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: await request.text(),
      cache: "no-store",
    });
  } catch {
    return Response.json(
      { success: false, message: "Could not reach the API" },
      { status: 502 },
    );
  }

  const json = await response.json().catch(() => null);
  if (!response.ok || !json?.data) {
    return Response.json(
      json ?? { success: false, message: "The API returned an invalid response" },
      { status: response.ok ? 502 : response.status },
    );
  }

  const { accessToken, user } = json.data;
  await saveSession(accessToken, user);
  return Response.json({ success: true, data: user });
}
