"use client";

import { useAuth } from "@/lib/auth-context";
import { ROUTES } from "@/lib/routes";
import Link from "next/link";

// DASHBOARDDDDDDD PLACEHOLDER LEROYYYY JENKINSS
export default function DashboardPage() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">
            Adoption System
          </h1>
          <nav className="flex items-center gap-4">
            <Link
              href={ROUTES.dashboard}
              className="text-sm text-gray-700 hover:text-gray-900"
            >
              Dashboard
            </Link>
            <span className="text-sm text-gray-600">
              {user?.name ?? user?.email}
            </span>
            <button
              onClick={() => signOut()}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Sign Out
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Dashboard
          </h2>
          <p className="text-gray-600">
            You are signed in and can navigate freely across the app.
          </p>
        </div>
      </main>
    </div>
  );
}
