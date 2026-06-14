import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "https://backend.test";
const AUTH_COOKIE = "auth_token";
const TOKEN_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

type Ctx = { params: Promise<{ path: string[] }> };

async function proxy(request: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  const segments = path.join("/");
  const target = `${BACKEND_URL}/api/${segments}${request.nextUrl.search}`;

  const token = request.cookies.get(AUTH_COOKIE)?.value;

  const headers = new Headers();
  headers.set("Accept", "application/json");
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const hasBody = !["GET", "HEAD"].includes(request.method);
  let backendRes: Response;
  try {
    backendRes = await fetch(target, {
      method: request.method,
      headers,
      body: hasBody ? await request.arrayBuffer() : undefined,
      redirect: "manual",
    });
  } catch (err) {
    console.error(
      `[api proxy] network error calling ${request.method} ${target}:`,
      err,
    );
    const cause = err instanceof Error ? err.message : String(err);
    const code =
      err && typeof err === "object" && "cause" in err
        ? ((err as { cause?: { code?: string } }).cause?.code ?? null)
        : null;
    return NextResponse.json(
      { message: "Backend unreachable", target, cause, code },
      { status: 502 },
    );
  }

  if (backendRes.status >= 300 && backendRes.status < 400) {
    const location = backendRes.headers.get("location");
    console.warn(
      `[api proxy] upstream ${request.method} ${target} returned ${backendRes.status} -> ${location}. ` +
        `Check BACKEND_URL scheme/host; Herd may be redirecting HTTP to HTTPS.`,
    );
    return NextResponse.json(
      {
        message:
          "Upstream returned a redirect. Check the Next.js server logs and BACKEND_URL.",
        status: backendRes.status,
        location,
      },
      { status: 502 },
    );
  }

  const responseContentType = backendRes.headers.get("content-type") ?? "";
  const isJson = responseContentType.includes("application/json");
  const payload: unknown = isJson
    ? await backendRes.json().catch(() => null)
    : await backendRes.text();

  if (backendRes.status >= 400) {
    console.warn(
      `[api proxy] upstream ${request.method} ${target} -> ${backendRes.status}`,
      typeof payload === "string" ? payload.slice(0, 500) : payload,
    );
  }

  const isAuthEndpoint =
    segments === "login" || segments === "register";
  const isLogout = segments === "logout";

  // Capture token from auth responses into an httpOnly cookie,
  // and strip it from the body sent to the browser.
  if (
    isAuthEndpoint &&
    backendRes.ok &&
    payload &&
    typeof payload === "object" &&
    "token" in payload &&
    typeof (payload as { token: unknown }).token === "string"
  ) {
    const { token: issued, ...rest } = payload as Record<string, unknown> & {
      token: string;
    };
    const res = NextResponse.json(rest, { status: backendRes.status });
    res.cookies.set({
      name: AUTH_COOKIE,
      value: issued,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: TOKEN_MAX_AGE,
    });
    return res;
  }

  const res = isJson
    ? NextResponse.json(payload, { status: backendRes.status })
    : new NextResponse(payload as string, {
        status: backendRes.status,
        headers: { "Content-Type": responseContentType || "text/plain" },
      });

  if (isLogout && backendRes.ok) {
    res.cookies.delete(AUTH_COOKIE);
  }

  if (segments === "user" && backendRes.status === 401) {
    res.cookies.delete(AUTH_COOKIE);
  }

  return res;
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const HEAD = proxy;
