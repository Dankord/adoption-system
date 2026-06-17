"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const AdminStatistics = () => {
  const { getAdminStats } = useAuth();
  const [stats, setStats] = useState<{
    total_users: number;
    total_customers: number;
    total_owners: number;
    total_pets: number;
    total_applications: number;
    total_adoptions: number;
    pending_applications: number;
    users_this_week: number;
    adoptions_this_month: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch {
        setStats(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [getAdminStats]);

  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-dm-serif)" }}>
          Statistics
        </h2>
        <p className="text-sm text-[#7A6150] pb-5">Platform overview and activity metrics.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="w-full">
              <CardHeader>
                <CardTitle className="text-sm">Loading...</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#7A6150] text-sm">Loading...</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const metrics = [
    { label: "Total Users", value: stats?.total_users ?? 0, color: "text-[#C4622D]" },
    { label: "Customers", value: stats?.total_customers ?? 0, color: "text-[#4A7C59]" },
    { label: "Owners", value: stats?.total_owners ?? 0, color: "text-[#D4A843]" },
    { label: "Total Pets", value: stats?.total_pets ?? 0, color: "text-[#C4622D]" },
    { label: "Total Applications", value: stats?.total_applications ?? 0, color: "text-[#4A7C59]" },
    { label: "Total Adoptions", value: stats?.total_adoptions ?? 0, color: "text-[#D4A843]" },
    { label: "Pending Applications", value: stats?.pending_applications ?? 0, color: "text-orange-600" },
    { label: "Users This Week", value: stats?.users_this_week ?? 0, color: "text-blue-600" },
    { label: "Adoptions This Month", value: stats?.adoptions_this_month ?? 0, color: "text-green-600" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-dm-serif)" }}>
        Statistics
      </h2>
      <p className="text-sm text-[#7A6150] pb-5">Platform overview and activity metrics.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="w-full">
            <CardHeader>
              <CardTitle>{metric.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-3xl font-bold ${metric.color}`} style={{ fontFamily: "var(--font-dm-serif)" }}>
                {metric.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-[#F2E8DB]">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-sm text-[#7A6150]">Customers</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{stats?.total_customers ?? 0}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[#F2E8DB]">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#C4622D]" />
                <span className="text-sm text-[#7A6150]">Owners</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{stats?.total_owners ?? 0}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span className="text-sm text-[#7A6150]">Admins</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">1</span>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Adoption Funnel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-[#F2E8DB]">
              <span className="text-sm text-[#7A6150]">Total Applications</span>
              <span className="text-sm font-semibold text-gray-900">{stats?.total_applications ?? 0}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[#F2E8DB]">
              <span className="text-sm text-[#7A6150]">Pending Review</span>
              <span className="text-sm font-semibold text-yellow-600">{stats?.pending_applications ?? 0}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-[#7A6150]">Completed Adoptions</span>
              <span className="text-sm font-semibold text-green-600">{stats?.total_adoptions ?? 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminStatistics;
