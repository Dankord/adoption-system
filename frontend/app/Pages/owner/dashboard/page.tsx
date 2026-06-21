"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { SiteHeader } from "@/components/site-header";
import OwnerCards from "./components/OwnerCards";
import { MenuBar } from "./components/MenuBar";
import OwnerPetListings from "./components/OwnerPetListings";
import OwnerApplications from "./components/OwnerApplications";
import OwnerStatistics from "./components/OwnerStatistics";
import OwnerMessages from "./components/OwnerMessages";
import { PawPrint } from "lucide-react";

type TabKey = "pets" | "applications" | "stats" | "messages";

export default function OwnerDashboardPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as TabKey | null) || "pets";
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);

  useEffect(() => {
    const tab = searchParams.get("tab") as TabKey | null;
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const renderContent = () => {
    switch (activeTab) {
      case "pets":
        return <OwnerPetListings />;
      case "applications":
        return <OwnerApplications />;
      case "stats":
        return <OwnerStatistics />;
      case "messages":
        return <OwnerMessages />;
      default:
        return <OwnerPetListings />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF6EE]">
      <SiteHeader />

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-8">
        <div className="my-6 sm:my-10">
          <div className="flex flex-col sm:flex-row gap-2 pb-2">
            <h1 className="text-2xl sm:text-4xl font-bold" style={{ fontFamily: "var(--font-dm-serif)" }}>Center Dashboard</h1>
            <PawPrint height="24" width="24" className="hidden sm:block" />
          </div>
          <p className="text-[#7A6150] text-sm sm:text-base">Manage your center&apos;s pets, applicants, and adoption activity in one place.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6 sm:mb-8">
          <OwnerCards type="pets_count" title={"Listed Pets"} />
          <OwnerCards type="pending_count" title={"Pending Review"} />
          <OwnerCards type="adopted_this_month" title={"Adopted This Month"} />
          <OwnerCards type="all_time_adoptions" title={"All-Time Adoptions"} />
        </div>

        <MenuBar activeTab={activeTab} onTabChange={setActiveTab} />

        {renderContent()}
      </main>
    </div>
  );
}
