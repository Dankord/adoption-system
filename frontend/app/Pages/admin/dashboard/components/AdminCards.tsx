"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface AdminCardsProps {
  title: string;
  type: "total_users" | "total_customers" | "total_owners" | "total_pets" | "total_applications" | "total_adoptions" | "pending_applications" | "users_this_week" | "adoptions_this_month";
}

const AdminCards = ({ title, type }: AdminCardsProps) => {
  const { getAdminStats } = useAuth();
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await getAdminStats();
        const value = stats[type];
        setCount(typeof value === "number" ? value : Number(value) || 0);
      } catch {
        setCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [type, getAdminStats]);

  return (
    <div className="w-full">
      <Card>
        <CardContent>
          <p className="text-lg sm:text-xl">{isLoading ? "—" : count}</p>
          <p className="text-xs sm:text-s text-[#7A6150] pt-2">{title}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCards;
