import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

import { backendUrl, clearSession, TOKEN_COOKIE } from "@/lib/session";

// Same-origin bridge to the API: the browser never sees the JWT, and because
// this call happens on the server, the API does not need CORS for this site.
async function handle(
  request: NextRequest,
  context: RouteContext<"/api/backend/[...path]">,
) {
  const { path } = await context.params;
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;
  const hasBody = request.method !== "GET";

  let response: globalThis.Response;
  try {
    response = await fetch(
      backendUrl(`/${path.map(encodeURIComponent).join("/")}${request.nextUrl.search}`),
      {
        method: request.method,
        headers: {
          ...(hasBody && { "Content-Type": "application/json" }),
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: hasBody ? await request.text() : undefined,
        cache: "no-store",
      },
    );
  } catch {
    return Response.json(
      { success: false, message: "Could not reach the API" },
      { status: 502 },
    );
  }

  if (response.status === 401) await clearSession();

  return new Response((await response.text()) || null, {
    status: response.status,
    headers: { "Content-Type": response.headers.get("Content-Type") ?? "application/json" },
  });
}

export { handle as GET, handle as POST, handle as PATCH, handle as DELETE };
