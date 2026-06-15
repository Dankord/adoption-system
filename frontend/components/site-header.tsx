"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { ROUTES, defaultAuthenticatedPath } from "@/lib/routes";

export function SiteHeader() {
  const { user, signOut } = useAuth();
  const isAuth = !user;

  return (
    <header className="bg-[#FFFAF4] shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href={ROUTES.home} className="text-xl font-semibold text-gray-900">
          Adoption System
        </Link>

        <nav className="flex items-center gap-4">
          
          {isAuth ? (
            <>
              <Link
                href={ROUTES.registration}
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                Register
              </Link>
              <Link
                href={ROUTES.signin}
                className="text-sm bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
              >
                Sign In
              </Link>
            </>
          ) : (
            <>
              <span className="text-sm text-gray-600">
                {user?.name ?? user?.email}
              </span>
              <button
                onClick={() => signOut()}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Sign Out
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export function dashboardHrefForUser(
  role: string | undefined,
  profileComplete: boolean,
): string {
  return defaultAuthenticatedPath(role, profileComplete);
}
