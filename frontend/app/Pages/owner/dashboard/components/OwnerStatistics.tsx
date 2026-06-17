"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const STATUS_COLORS: Record<string, string> = {
  available: "bg-[#4A7C59]",
  under_review: "bg-[#D4A843]",
  reserved: "bg-orange-500",
  adopted: "bg-[#C4622D]",
};

const STATUS_LABELS: Record<string, string> = {
  available: "Available",
  under_review: "Under Review",
  reserved: "Reserved",
  adopted: "Adopted",
};

const APP_STATUS_COLORS: Record<string, string> = {
  submitted: "bg-[#C4622D]",
  under_review: "bg-[#D4A843]",
  approved: "bg-[#4A7C59]",
  reserved: "bg-orange-500",
  rejected: "bg-red-500",
  cancelled: "bg-gray-400",
  completed: "bg-[#4A7C59]",
};

const APP_STATUS_LABELS: Record<string, string> = {
  submitted: "Submitted",
  under_review: "Under Review",
  approved: "Approved",
  reserved: "Reserved",
  rejected: "Rejected",
  cancelled: "Cancelled",
  completed: "Completed",
};

const SPECIES_COLORS: Record<string, string> = {
  Dog: "bg-[#C4622D]",
  Cat: "bg-[#D4A843]",
  Rabbit: "bg-[#4A7C59]",
  Bird: "bg-orange-500",
  Other: "bg-gray-400",
};

const SPECIES_LABELS: Record<string, string> = {
  Dog: "Dog",
  Cat: "Cat",
  Rabbit: "Rabbit",
  Bird: "Bird",
  Other: "Other",
};

const OwnerStatistics = () => {
  const { getOwnersDashboardStats } = useAuth();
  const [petStatusBreakdown, setPetStatusBreakdown] = useState<Record<string, number>>({});
  const [appStatus, setAppStatus] = useState<Record<string, number>>({});
  const [keyMetrics, setKeyMetrics] = useState<Record<string, number>>({});
  const [speciesDistribution, setSpeciesDistribution] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await getOwnersDashboardStats();
        setPetStatusBreakdown(stats.pet_status_breakdown);
        setAppStatus(stats.application_status);
        setKeyMetrics(stats.key_metrics);
        setSpeciesDistribution(stats.species_distribution);
      } catch {
        setPetStatusBreakdown({});
        setAppStatus({});
        setKeyMetrics({});
        setSpeciesDistribution({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [getOwnersDashboardStats]);

  const totalPets = Object.values(petStatusBreakdown).reduce((a, b) => a + b, 0);
  const totalApps = Object.values(appStatus).reduce((a, b) => a + b, 0);
  const totalSpecies = Object.values(speciesDistribution).reduce((a, b) => a + b, 0);

  const ProgressBar = ({ count, total, color }: { count: number; total: number; color: string }) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
      <div className="w-full">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-[#7A6150]">{count}</span>
          <span className="text-[#7A6150]/60">{percentage.toFixed(0)}%</span>
        </div>
        <div className="w-full h-2 bg-[#F2E8DB] rounded-full overflow-hidden">
          <div
            className={`h-full ${color} rounded-full transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-dm-serif)" }}>
          Statistics
        </h2>
        <p className="text-s text-[#7A6150] pb-5">An overview of your center&apos;s activity and adoption trends.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
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

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-dm-serif)" }}>
        Statistics
      </h2>
      <p className="text-s text-[#7A6150] pb-5">An overview of your center&apos;s activity and adoption trends.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pet Status Breakdown */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Pet Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(petStatusBreakdown).map(([status, count]) => (
              <div key={status} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-[#7A6150]">{STATUS_LABELS[status] || status}</span>
                </div>
                <ProgressBar
                  count={count}
                  total={totalPets}
                  color={STATUS_COLORS[status] || "bg-gray-400"}
                />
              </div>
            ))}
            {totalPets === 0 && (
              <p className="text-sm text-[#7A6150]/60 italic">No pets listed yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Applications by Status */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Applications by Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(appStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between py-2 border-b border-[#F2E8DB] last:border-0">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${APP_STATUS_COLORS[status] || "bg-gray-400"}`} />
                  <span className="text-sm text-[#7A6150]">{APP_STATUS_LABELS[status] || status}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{count}</span>
              </div>
            ))}
            {totalApps === 0 && (
              <p className="text-sm text-[#7A6150]/60 italic">No applications yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#C4622D]" style={{ fontFamily: "var(--font-dm-serif)" }}>
                  {keyMetrics.adopted_this_month ?? 0}
                </p>
                <p className="text-xs text-[#7A6150] mt-1">Adopted This Month</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#4A7C59]" style={{ fontFamily: "var(--font-dm-serif)" }}>
                  {keyMetrics.total_listed ?? 0}
                </p>
                <p className="text-xs text-[#7A6150] mt-1">Total Listed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#D4A843]" style={{ fontFamily: "var(--font-dm-serif)" }}>
                  {keyMetrics.pending_applications ?? 0}
                </p>
                <p className="text-xs text-[#7A6150] mt-1">Pending Apps</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Species Distribution */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Species Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(speciesDistribution).map(([species, count]) => (
              <div key={species} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-[#7A6150] flex items-center gap-2">
                    {SPECIES_LABELS[species] || species}
                  </span>
                </div>
                <ProgressBar
                  count={count}
                  total={totalSpecies}
                  color={SPECIES_COLORS[species] || "bg-gray-400"}
                />
              </div>
            ))}
            {totalSpecies === 0 && (
              <p className="text-sm text-[#7A6150]/60 italic">No species data yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OwnerStatistics;
