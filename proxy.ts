import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { parseUser, TOKEN_COOKIE, USER_COOKIE } from "@/lib/session";

const GUEST_ONLY = ["/login", "/register"];

// Fast redirects for page navigation. Real authorization is the API's job.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const signedIn = request.cookies.has(TOKEN_COOKIE);
  const guestOnly = GUEST_ONLY.includes(pathname);

  if (!signedIn && !guestOnly) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (signedIn && guestOnly) {
    return NextResponse.redirect(new URL("/notes", request.url));
  }
  if (pathname.startsWith("/admin")) {
    const user = parseUser(request.cookies.get(USER_COOKIE)?.value);
    if (user?.role !== "admin") {
      return NextResponse.redirect(new URL("/notes", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$).*)"],
};
