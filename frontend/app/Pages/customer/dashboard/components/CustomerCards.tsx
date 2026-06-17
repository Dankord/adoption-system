"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface CustomerCardsProps {
  title: string;
  type: "applications_count" | "under_review_count" | "approved_count" | "care_reminders_count";
}

const CustomerCards = ({ title, type }: CustomerCardsProps) => {
  const { getDashboardStats } = useAuth();
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await getDashboardStats();
        const customerStats = (stats as Record<string, unknown>)["customer"] as Record<string, unknown> | undefined;
        if (customerStats) {
          const value = customerStats[type];
          setCount(typeof value === "number" ? value : Number(value) || 0);
        }
      } catch {
        setCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [type, getDashboardStats]);

  return (
    <div className="w-175">
      <Card>
        <CardContent>
          <p className="text-xl">{isLoading ? "—" : count}</p>
          <p className="text-s text-[#7A6150] pt-2">{title}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerCards;
