"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { SiteHeader, dashboardHrefForUser } from "@/components/site-header";
import { ROUTES } from "@/lib/routes";

export default function LandingPage() {
  const { user, isAuthenticated, isLoading } = useAuth();

  const dashboardHref =
    isAuthenticated && user
      ? dashboardHrefForUser(user.role, Boolean(user.profile_completed_at))
      : ROUTES.signin;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* LABIANO */}
      <SiteHeader />

      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Find your next companion
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl">
            The Adoption System connects families with pets in need of a home.
            Browse listings, manage adoptions, and help animals find loving
            families.
          </p>

          <div className="flex flex-wrap gap-4">
            {!isLoading && isAuthenticated ? (
              <Link
                href={dashboardHref}
                className="inline-flex items-center bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors font-medium"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href={ROUTES.signin}
                  className="inline-flex items-center bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href={ROUTES.registration}
                  className="inline-flex items-center border border-gray-300 text-gray-900 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors font-medium"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
