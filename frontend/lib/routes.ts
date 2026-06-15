export type UserRole = "customer" | "owner" | "admin";

export const ROUTES = {
  home: "/",
  signin: "/Pages/signin",
  registration: "/Pages/signin/auth/registration",
  onboarding: "/Pages/onboarding",
  customerDashboard: "/Pages/customer/dashboard",
  ownerDashboard: "/Pages/owner/dashboard",
  adminDashboard: "/Pages/admin/dashboard",
} as const;

/** Routes only for signed-out users (sign-in, register). */
export const GUEST_PATHS = [ROUTES.signin, ROUTES.registration] as const;

const ROLE_PREFIXES: Record<UserRole, string> = {
  customer: "/Pages/customer",
  owner: "/Pages/owner",
  admin: "/Pages/admin",
};

export function isGuestPath(pathname: string): boolean {
  return GUEST_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

/** App pages that require a valid session (everything under /Pages except guest routes). */
export function isProtectedPath(pathname: string): boolean {
  return pathname.startsWith("/Pages") && !isGuestPath(pathname);
}

export function normalizeRole(role: string | undefined): UserRole {
  if (role === "owner" || role === "admin") {
    return role;
  }
  return "customer";
}

export function roleDashboardPath(role: string | undefined): string {
  switch (normalizeRole(role)) {
    case "admin":
      return ROUTES.adminDashboard;
    case "owner":
      return ROUTES.ownerDashboard;
    default:
      return ROUTES.customerDashboard;
  }
}

/** Only customers must complete onboarding before accessing the app. */
export function requiresOnboarding(
  role: string | undefined,
  profileComplete: boolean,
): boolean {
  return normalizeRole(role) === "customer" && !profileComplete;
}

export function defaultAuthenticatedPath(
  role: string | undefined,
  profileComplete: boolean,
): string {
  if (requiresOnboarding(role, profileComplete)) {
    return ROUTES.onboarding;
  }
  return roleDashboardPath(role);
}

export function signinWithCallback(callback: string): string {
  return `${ROUTES.signin}?callback=${encodeURIComponent(callback)}`;
}

export function canAccessPath(pathname: string, role: string | undefined): boolean {
  const normalizedRole = normalizeRole(role);

  if (pathname === ROUTES.onboarding) {
    return normalizedRole === "customer";
  }

  const allowedPrefix = ROLE_PREFIXES[normalizedRole];
  return pathname === allowedPrefix || pathname.startsWith(`${allowedPrefix}/`);
}

export function isRoleScopedPath(pathname: string): boolean {
  return (
    pathname.startsWith("/Pages/customer") ||
    pathname.startsWith("/Pages/owner") ||
    pathname.startsWith("/Pages/admin")
  );
}
