export const ROUTES = {
  home: "/",
  signin: "/Pages/signin",
  registration: "/Pages/signin/auth/registration",
  onboarding: "/Pages/onboarding",
  dashboard: "/Pages/dashboard",
} as const;

/** Routes only for signed-out users (sign-in, register). */
export const GUEST_PATHS = [ROUTES.signin, ROUTES.registration] as const;

export function isGuestPath(pathname: string): boolean {
  return GUEST_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

/** App pages that require a valid session (everything under /Pages except guest routes). */
export function isProtectedPath(pathname: string): boolean {
  return pathname.startsWith("/Pages") && !isGuestPath(pathname);
}

export function defaultAuthenticatedPath(profileComplete: boolean): string {
  return profileComplete ? ROUTES.dashboard : ROUTES.onboarding;
}

export function signinWithCallback(callback: string): string {
  return `${ROUTES.signin}?callback=${encodeURIComponent(callback)}`;
}
