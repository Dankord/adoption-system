import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = ["/Pages/dashboard", "/Pages/profile", "/Pages/settings"];
const authPaths = ["/Pages/signin"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;
  const user = request.cookies.get("user")?.value;

  const isProtectedPath = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );
  const isAuthPath = authPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );
  const isAuthPage = authPaths.some(
    (path) => pathname === path || pathname.startsWith(path +"/")
  )

  // If there's no valid auth state
  const isAuthenticated = !!token && !!user;

  // Redirect unauthenticated users away from protected routes
  if (isProtectedPath && !isAuthenticated) {
    const url = new URL("/Pages/signin", request.url);
    url.searchParams.set("callback", request.url);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from signin pages
  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/Pages/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/Pages/:path*"],
};
