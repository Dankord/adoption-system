"use client";

import { useAuth } from "@/lib/auth-context";
import { SiteHeader } from "@/components/site-header";
import { PawPrint } from "lucide-react";

export default function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#FDF6EE]">
      <SiteHeader />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="my-10">
          <div className="flex gap-2 pb-2">
            <h1 className="text-4xl font-bold" style={{ fontFamily: "var(--font-dm-serif)" }}>Welcome, {user?.email}</h1>
            <PawPrint height="30" width="30" />
          </div>
          <p className="text-[#7A6150]">Monitor adoptions, manage centers, and oversee all system activity.</p>
        </div>
      </main>
    </div>
  );
}
