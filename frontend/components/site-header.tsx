"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  ROUTES,
  defaultAuthenticatedPath,
  isProfileComplete,
} from "@/lib/routes";

export function SiteHeader() {
  const { user, isAuthenticated, isLoading, signOut } = useAuth();

  const dashboardHref = user
    ? defaultAuthenticatedPath(
        user.role,
        isProfileComplete(user.role, user.profile_completed_at),
      )
    : ROUTES.signin;

  return (
    <header className="bg-[#FFFAF4] shadow-sm border-b border-[#dabcac]/40">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href={ROUTES.home}
          className="text-2xl text-gray-900"
          style={{ fontFamily: "var(--font-dm-serif)" }}
        >
          Adoptify
        </Link>

        <nav className="flex items-center gap-3 sm:gap-4">
          {!isLoading && isAuthenticated && user ? (
            <>
              <Link
                href={dashboardHref}
                className="text-sm text-[#7A6150] hover:text-[#C4622D] transition-colors hidden sm:inline"
              >
                Dashboard
              </Link>
              <span className="text-sm text-[#7A6150] max-w-[140px] truncate">
                {user.customer?.customer_name ?? user.email}
              </span>
              <button
                onClick={() => signOut()}
                className="text-sm text-[#C4622D] hover:text-amber-800 font-medium"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href={ROUTES.registration}
                className="text-sm text-[#7A6150] hover:text-[#C4622D] transition-colors"
              >
                Register
              </Link>
              <Link
                href={ROUTES.signin}
                className="text-sm bg-[#C4622D] text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors"
              >
                Sign In
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export function dashboardHrefForUser(
  role: string | undefined,
  profileCompletedAt: string | null | undefined,
): string {
  return defaultAuthenticatedPath(
    role,
    isProfileComplete(role, profileCompletedAt),
  );
}
