"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";

const STATUS_STYLES: Record<string, string> = {
  submitted: "bg-[#E8DDD3] text-[#C4622D] border-[#dabcac]",
  under_review: "bg-yellow-50 text-yellow-700 border-yellow-200",
  approved: "bg-green-50 text-green-700 border-green-200",
  reserved: "bg-orange-50 text-orange-700 border-orange-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  cancelled: "bg-gray-50 text-gray-500 border-gray-200",
  completed: "bg-[#C4622D] text-white border-[#C4622D]",
};

const STATUS_LABELS: Record<string, string> = {
  submitted: "Submitted",
  under_review: "Under Review",
  approved: "Approved",
  reserved: "Reserved",
  rejected: "Rejected",
  cancelled: "Cancelled",
  completed: "Completed",
};

const APPLICATION_STEPS = [
  { label: "Submitted", statuses: ["submitted"] },
  { label: "Screening", statuses: ["under_review"] },
  { label: "Interview", statuses: ["reserved"] },
  { label: "Approved", statuses: ["approved"] },
  { label: "Rejected", statuses: ["rejected"] },
  { label: "Completed", statuses: ["completed"] },
];

function getStepInfo(status: string) {
  for (let i = 0; i < APPLICATION_STEPS.length; i++) {
    if (APPLICATION_STEPS[i].statuses.includes(status)) {
      return {
        currentStep: i,
        totalSteps: APPLICATION_STEPS.length,
        label: APPLICATION_STEPS[i].label,
      };
    }
  }
  return {
    currentStep: 0,
    totalSteps: APPLICATION_STEPS.length,
    label: "Submitted",
  };
}

function ApplicationCard({
  appName,
  petSpecies,
  petBreed,
  submittedAt,
  status,
}: {
  appName: string;
  petSpecies: string;
  petBreed: string;
  submittedAt: string;
  status: string;
}) {
  const { currentStep } = getStepInfo(status);

  const stepStatuses: Record<string, { line: string; dot: string; text: string; badge?: string }> = {
    completed: {
      line: "bg-[#4A7C59]",
      dot: "bg-[#4A7C59]",
      text: "text-[#4A7C59]",
    },
    current: {
      line: "bg-[#4A7C59]",
      dot: "bg-[#D4A843] ring-4 ring-[#D4A843]/30",
      text: "text-[#D4A843] font-semibold",
    },
    pending: {
      line: "bg-[#D1D5DB]",
      dot: "bg-[#D1D5DB]",
      text: "text-[#9CA3AF]",
    },
  };

  const formattedDate = new Date(submittedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="bg-white rounded-2xl border border-[#dabcac] overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="p-5">
        {/* Header: Pet info + Status badge */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#C4622D]/10 flex items-center justify-center flex-shrink-0">
                <span className="text-[#C4622D] font-bold text-sm">
                  {appName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900" style={{ fontFamily: "var(--font-dm-serif)" }}>
                  {appName}
                </h3>
                <p className="text-xs text-[#7A6150]">
                  {petSpecies}
                  {petBreed && ` · ${petBreed}`}
                </p>
              </div>
            </div>

            <p className="text-xs text-[#7A6150]/60">Applied on {formattedDate}</p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span className={`px-3 py-1 rounded-full border text-xs font-medium ${STATUS_STYLES[status] ?? STATUS_STYLES.submitted}`}>
              {STATUS_LABELS[status] ?? status}
            </span>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mt-6">
          <div className="relative flex items-center justify-between">
            <div className="absolute top-[50%] left-0 w-full h-0.5 bg-[#D1D5DB] -translate-y-1/2 rounded"></div>

            {APPLICATION_STEPS.map((step, index) => {
              let styleKey: string;
              if (index < currentStep) {
                styleKey = "completed";
              } else if (index === currentStep) {
                styleKey = "current";
              } else {
                styleKey = "pending";
              }

              const style = stepStatuses[styleKey];

              return (
                <div key={index} className="relative flex flex-col items-center z-10">
                  <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full ${style.dot} transition-colors`}></div>
                  <span className={`mt-1.5 text-[10px] sm:text-xs ${style.text}`}>{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

const CustomerMyApplications = () => {
  const { user, getApplications } = useAuth();
  const [applications, setApplications] = useState<import("@/lib/auth-context").OwnerApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getApplications();
        const customerApps = data.filter(
          (app) => app.customer_name === user?.customer?.customer_name
        );
        setApplications(customerApps);
      } catch {
        setApplications([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.customer?.customer_name) {
      fetchApplications();
    }
  }, [user, getApplications]);

  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-dm-serif)" }}>
          My Applications
        </h2>
        <p className="text-sm text-[#7A6150] pb-5">Track your adoption journey and pet care reminders all in one place.</p>
        <div className="text-center py-12">
          <p className="text-[#7A6150]">Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-dm-serif)" }}>
        My Applications
      </h2>
      <p className="text-sm text-[#7A6150] pb-5">Track your adoption journey and pet care reminders all in one place.</p>

      {applications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">🐾</p>
          <p className="text-[#7A6150]">You haven&apos;t applied to adopt any pets yet.</p>
          <p className="text-xs text-[#7A6150]/60 mt-1">Browse available pets in the For You tab to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {applications.map((app) => (
            <ApplicationCard
              key={app.id}
              appName={app.pet_name}
              petSpecies={app.pet_species}
              petBreed={app.pet_breed}
              submittedAt={app.submitted_at}
              status={app.status}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerMyApplications;
