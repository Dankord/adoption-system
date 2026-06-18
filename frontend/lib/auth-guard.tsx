"use client";

import { useAuth } from "@/lib/auth-context";
import {
  ROUTES,
  canAccessPath,
  defaultAuthenticatedPath,
  isGuestPath,
  isProfileComplete,
  requiresOnboarding,
  signinWithCallback,
} from "@/lib/routes";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useMemo } from "react";

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
    </div>
  );
}

type AccessState = "loading" | "allowed" | "redirecting";

function resolveAccess(
  pathname: string,
  isLoading: boolean,
  isAuthenticated: boolean,
  role: string | undefined,
  profileComplete: boolean,
): AccessState {
  if (isLoading) {
    return "loading";
  }

  const onGuestPage = isGuestPath(pathname);
  const onOnboarding = pathname.toLowerCase() === ROUTES.onboarding.toLowerCase();
  const needsOnboarding = requiresOnboarding(role, profileComplete);

  if (!isAuthenticated) {
    return onGuestPage ? "allowed" : "redirecting";
  }

  if (onGuestPage) {
    return "redirecting";
  }

  if (needsOnboarding) {
    return onOnboarding ? "allowed" : "redirecting";
  }

  if (onOnboarding) {
    return "redirecting";
  }

  if (!canAccessPath(pathname, role)) {
    return "redirecting";
  }

  return "allowed";
}

export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();

  const role = user?.role;
  const profileComplete = isProfileComplete(role, user?.profile_completed_at);

  const access = useMemo(
    () =>
      resolveAccess(
        pathname,
        isLoading,
        isAuthenticated,
        role,
        profileComplete,
      ),
    [pathname, isLoading, isAuthenticated, role, profileComplete],
  );

  useEffect(() => {
    if (access !== "redirecting") {
      return;
    }

    let target = "";

    if (!isAuthenticated) {
      target = signinWithCallback(pathname);
    } else if (isGuestPath(pathname)) {
      target = defaultAuthenticatedPath(role, profileComplete);
    } else if (requiresOnboarding(role, profileComplete)) {
      if (pathname === ROUTES.onboarding) return;
      target = ROUTES.onboarding;
    } else {
      target = defaultAuthenticatedPath(role, profileComplete);
    }

    if (!target) return;
    window.location.href = target;
  }, [access, isAuthenticated, pathname, profileComplete, role]);

  if (access === "loading" || access === "redirecting") {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
