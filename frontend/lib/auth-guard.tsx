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

  // Authenticated users on signin/registration pages can stay (header handles nav)
  // This prevents redirect loops that leave the user stuck on a loading screen
  if (onGuestPage) {
    return "allowed";
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

  console.log("[AuthGuard]", { pathname, role, isAuthenticated, isLoading, profileComplete });

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

  console.log("[AuthGuard] resolved access:", access);

  const lastRedirectTarget = useRef<string | null>(null);

  useEffect(() => {
    console.log("[AuthGuard] effect firing, access:", access);
    if (access !== "redirecting") {
      lastRedirectTarget.current = null;
      return;
    }

    let target = "";

    if (!isAuthenticated) {
      target = signinWithCallback(pathname);
    } else if (isGuestPath(pathname)) {
      target = defaultAuthenticatedPath(role, profileComplete);
    } else if (requiresOnboarding(role, profileComplete)) {
      if (pathname.toLowerCase() === ROUTES.onboarding.toLowerCase()) return;
      target = ROUTES.onboarding;
    } else {
      target = defaultAuthenticatedPath(role, profileComplete);
      if (pathname.toLowerCase() === target.toLowerCase()) return;
    }

    if (!target) return;
    if (lastRedirectTarget.current === target.toLowerCase()) return;
    lastRedirectTarget.current = target.toLowerCase();
    console.log("[AuthGuard] NAVIGATING to:", target);
    router.replace(target);
  }, [access, isAuthenticated, pathname, profileComplete, role, router]);

  if (access === "loading" || access === "redirecting") {
    console.log("[AuthGuard] SHOWING LOADING SCREEN (access =", access, ")");
    return <LoadingScreen />;
  }

  console.log("[AuthGuard] RENDERING CHILDREN");
  return <>{children}</>;
}
