import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isGuestPath, isProtectedPath, signinWithCallback } from "@/lib/routes";

const AUTH_COOKIE = "auth_token";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasToken = Boolean(request.cookies.get(AUTH_COOKIE)?.value);

  if (isProtectedPath(pathname) && !hasToken) {
    return NextResponse.redirect(
      new URL(signinWithCallback(pathname), request.url),
    );
  }

  // Signed-in users on guest pages are redirected by AuthGuard (role-aware).
  if (isGuestPath(pathname) && hasToken) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/Pages/:path*"],
};
