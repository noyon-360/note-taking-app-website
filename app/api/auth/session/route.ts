import { cookies } from "next/headers";

import { parseUser, TOKEN_COOKIE, USER_COOKIE } from "@/lib/session";

export async function GET() {
  const store = await cookies();
  const user = store.has(TOKEN_COOKIE)
    ? parseUser(store.get(USER_COOKIE)?.value)
    : null;
  return Response.json({ success: true, data: user });
}
