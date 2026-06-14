"use client";

import { useAuth } from "@/lib/auth-context";
import {
  ROUTES,
  defaultAuthenticatedPath,
  isGuestPath,
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

type AccessState =
  | "loading"
  | "allowed"
  | "redirecting";

function resolveAccess(
  pathname: string,
  isLoading: boolean,
  isAuthenticated: boolean,
  profileComplete: boolean,
): AccessState {
  if (isLoading) {
    return "loading";
  }

  const onGuestPage = isGuestPath(pathname);
  const onOnboarding = pathname === ROUTES.onboarding;

  if (!isAuthenticated) {
    return onGuestPage ? "allowed" : "redirecting";
  }

  if (onGuestPage) {
    return "redirecting";
  }

  if (!profileComplete && !onOnboarding) {
    return "redirecting";
  }

  if (profileComplete && onOnboarding) {
    return "redirecting";
  }

  return "allowed";
}

export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const profileComplete = Boolean(user?.profile_completed_at);

  const access = useMemo(
    () =>
      resolveAccess(pathname, isLoading, isAuthenticated, profileComplete),
    [pathname, isLoading, isAuthenticated, profileComplete],
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
      router.replace(defaultAuthenticatedPath(profileComplete));
      return;
    }

    if (!profileComplete && pathname !== ROUTES.onboarding) {
      router.replace(ROUTES.onboarding);
      return;
    }

    if (profileComplete && pathname === ROUTES.onboarding) {
      router.replace(ROUTES.dashboard);
    }
  }, [access, isAuthenticated, pathname, profileComplete, router]);

  if (access === "loading" || access === "redirecting") {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
