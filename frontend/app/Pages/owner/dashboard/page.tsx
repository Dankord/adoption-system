"use client";

import { useAuth } from "@/lib/auth-context";
import { SiteHeader } from "@/components/site-header";
import { ROUTES } from "@/lib/routes";
import Link from "next/link";

export default function OwnerDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Owner Dashboard
          </h2>
          <p className="text-gray-600 mb-4">
            Welcome{user?.name ? `, ${user.name}` : ""}. Manage your shelter
            listings and adoption requests.
          </p>
          <Link
            href={ROUTES.home}
            className="text-sm text-gray-700 hover:text-gray-900 underline"
          >
            Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
