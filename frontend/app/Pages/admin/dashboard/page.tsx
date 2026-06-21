"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { SiteHeader } from "@/components/site-header";
import AdminCards from "./components/AdminCards";
import { MenuBar } from "./components/MenuBar";
import AdminUsers from "./components/AdminUsers";
import AdminStatistics from "./components/AdminStatistics";
import { Shield } from "lucide-react";

type TabKey = "users" | "stats";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as TabKey | null) || "users";
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);

  useEffect(() => {
    const tab = searchParams.get("tab") as TabKey | null;
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return <AdminUsers />;
      case "stats":
        return <AdminStatistics />;
      default:
        return <AdminUsers />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF6EE]">
      <SiteHeader />

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-8">
        <div className="my-6 sm:my-10">
          <div className="flex flex-col sm:flex-row gap-2 pb-2">
            <h1 className="text-2xl sm:text-4xl font-bold" style={{ fontFamily: "var(--font-dm-serif)" }}>Admin Dashboard</h1>
            <Shield height="24" width="24" className="hidden sm:block" />
          </div>
          <p className="text-[#7A6150] text-sm sm:text-base">Manage users, oversee platform activity, and maintain system integrity.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6 sm:mb-8">
          <AdminCards type="total_users" title={"Total Users"} />
          <AdminCards type="total_customers" title={"Customers"} />
          <AdminCards type="total_owners" title={"Owners"} />
          <AdminCards type="total_pets" title={"Total Pets"} />
        </div>

        <MenuBar activeTab={activeTab} onTabChange={setActiveTab} />

        {renderContent()}
      </main>
    </div>
  );
}
