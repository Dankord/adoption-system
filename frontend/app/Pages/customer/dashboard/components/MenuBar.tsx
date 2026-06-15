"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Heart,
  LucideIcon,
  MessageCircle,
  PawPrint,
} from "lucide-react";

type TabKey = "applications" | "for-you" | "messages" | "pet-care";

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
  { label: "My Applications", key: "applications", icon: FileText },
  { label: "For you", key: "for-you", icon: Heart },
  { label: "Messages", key: "messages", icon: MessageCircle },
  { label: "Pet Care", key: "pet-care", icon: PawPrint },
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
                layoutId="active-tab"
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