import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ROUTES,
  isGuestPath,
  isProtectedPath,
  signinWithCallback,
} from "@/lib/routes";

const AUTH_COOKIE = "auth_token";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasToken = Boolean(request.cookies.get(AUTH_COOKIE)?.value);

  if (isProtectedPath(pathname) && !hasToken) {
    return NextResponse.redirect(
      new URL(signinWithCallback(pathname), request.url),
    );
  }

  if (isGuestPath(pathname) && hasToken) {
    return NextResponse.redirect(new URL(ROUTES.dashboard, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/Pages/:path*"],
};
