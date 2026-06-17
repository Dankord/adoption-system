"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { SiteHeader } from "@/components/site-header";
import CustomerCard from "./components/CustomerCards";
import { MenuBar } from "./components/MenuBar";
import CustomerMessages from "./components/CustomerMessages";
import CustomerMyApplications from "./components/CustomerMyApplications";
import CustomerForYouCard from "./components/CustomerForYouCard";
import CustomerPetCare from "./components/CustomerPetCare";
import CustomerProfile from "./components/CustomerProfile";
import EditProfileModal from "./components/EditProfileModal";
import {
  PawPrint,
} from "lucide-react";

type TabKey = "applications" | "for-you" | "messages" | "pet-care" | "profile";

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>("applications");
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
       case "applications":
          return <CustomerMyApplications />;
      case "for-you":
        return <CustomerForYouCard />;
      case "messages":
        return <CustomerMessages />;
      case "pet-care":
        return <CustomerPetCare />;
      case "profile":
        return <CustomerProfile onEdit={() => setIsEditProfileOpen(true)} />;
      default:
          return <CustomerMyApplications />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF6EE]">
      <SiteHeader />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="my-10">
          <div className="flex gap-2 pb-2">
          <h1 className="text-4xl font-bold" style={{ fontFamily: "var(--font-dm-serif)" }}>Welcome, {user?.customer?.customer_name}</h1>
          <PawPrint height="30" width="30"/>
          </div>
          <p className="text-[#7A6150]">Track your adoption journey and pet care reminders all in one place.</p>
        </div>

        <div className="flex gap-2 mb-8">
          <CustomerCard type="applications_count" title={"Applications"} />
          <CustomerCard type="under_review_count" title={"Under Review"} />
          <CustomerCard type="approved_count" title={"Approved"} />
          <CustomerCard type="care_reminders_count" title={"Care Reminders"} />
        </div>

        <MenuBar activeTab={activeTab} onTabChange={setActiveTab} />

        {renderContent()}
      </main>

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />
    </div>
  );
}
