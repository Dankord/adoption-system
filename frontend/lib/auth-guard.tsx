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
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useMemo, useRef } from "react";

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
  const router = useRouter();

  const role = user?.role;
  const profileComplete = isProfileComplete(role, user?.profile_completed_at);

  console.log("[AuthGuard] render, user:", user, "isAuthenticated:", isAuthenticated, "isLoading:", isLoading, "pathname:", pathname);

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

  console.log("[AuthGuard] access:", access);

  const lastRedirectTarget = useRef<string | null>(null);

  useEffect(() => {
    console.log("[AuthGuard] effect, access:", access);
    if (access !== "redirecting") {
      console.log("[AuthGuard] effect: not redirecting, returning");
      lastRedirectTarget.current = null;
      return;
    }

    let target = "";

    if (!isAuthenticated) {
      console.log("[AuthGuard] redirecting to signin");
      target = signinWithCallback(pathname);
    } else if (isGuestPath(pathname)) {
      console.log("[AuthGuard] redirecting to default (guest path)");
      target = defaultAuthenticatedPath(role, profileComplete);
    } else if (requiresOnboarding(role, profileComplete)) {
      if (pathname.toLowerCase() === ROUTES.onboarding.toLowerCase()) {
        console.log("[AuthGuard] already on onboarding, skipping");
        return;
      }
      console.log("[AuthGuard] redirecting to onboarding");
      target = ROUTES.onboarding;
    } else {
      target = defaultAuthenticatedPath(role, profileComplete);
      if (pathname.toLowerCase() === target.toLowerCase()) {
        console.log("[AuthGuard] already on target, skipping");
        return;
      }
      console.log("[AuthGuard] redirecting to default");
    }

    if (!target) {
      console.log("[AuthGuard] no target, returning");
      return;
    }

    if (lastRedirectTarget.current === target.toLowerCase()) {
      console.log("[AuthGuard] duplicate redirect target, skipping");
      return;
    }

    console.log("[AuthGuard] calling router.replace to:", target);
    lastRedirectTarget.current = target.toLowerCase();
    router.replace(target);
  }, [access, isAuthenticated, pathname, profileComplete, role, router]);

  if (access === "loading" || access === "redirecting") {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
