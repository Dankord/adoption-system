"use client";

import { useAuth } from "@/lib/auth-context";
import {
  ROUTES,
  canAccessPath,
  defaultAuthenticatedPath,
  isGuestPath,
  requiresOnboarding,
  signinWithCallback,
} from "@/lib/routes";
import { usePathname, useRouter } from "next/navigation";
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
  const onOnboarding = pathname === ROUTES.onboarding;
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
  const router = useRouter();

  const profileComplete = Boolean(user?.profile_completed_at);
  const role = user?.role;

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

    if (!isAuthenticated) {
      router.replace(signinWithCallback(pathname));
      return;
    }

    if (isGuestPath(pathname)) {
      router.replace(defaultAuthenticatedPath(role, profileComplete));
      return;
    }

    if (requiresOnboarding(role, profileComplete)) {
      router.replace(ROUTES.onboarding);
      return;
    }

    router.replace(defaultAuthenticatedPath(role, profileComplete));
  }, [access, isAuthenticated, pathname, profileComplete, role, router]);

  if (access === "loading" || access === "redirecting") {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
