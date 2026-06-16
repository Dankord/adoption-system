"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  LucideIcon,
  MessageCircle,
  PawPrint,
  Users,
} from "lucide-react";

type TabKey = "pets" | "applications" | "stats" | "messages";

interface TabItem {
  label: string;
  key: TabKey;
  icon: LucideIcon;
}

interface MenuBarProps {
  activeTab: TabKey;
  onTabChange: (key: TabKey) => void;
}

const tabs: TabItem[] = [
  { label: "Pet Listings", key: "pets", icon: PawPrint },
  { label: "Applicants", key: "applications", icon: Users },
  { label: "Statistics", key: "stats", icon: BarChart3 },
  { label: "Messages", key: "messages", icon: MessageCircle },
];

export const MenuBar = ({ activeTab, onTabChange }: MenuBarProps) => {
  return (
    <div className="inline-flex rounded-2xl w-full bg-white p-2 shadow-sm mb-5">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className="relative px-6 py-3 text-sm font-medium"
          >
            {activeTab === tab.key && (
              <motion.div
                layoutId="owner-active-tab"
                className="absolute inset-0 rounded-xl bg-[#EAD8C6]"
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                }}
              />
            )}

            <span
              className={`relative z-10 flex gap-2  items-center ${activeTab === tab.key
                  ? "text-[#7A6150] font-semibold"
                  : "text-[#7A6150]/60"
                }`}
            >
              <Icon size={15} />
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
