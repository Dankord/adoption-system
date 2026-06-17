"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

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

const STATUS_OPTIONS = [
  "submitted",
  "under_review",
  "approved",
  "reserved",
  "rejected",
  "cancelled",
  "completed",
];

export default function OwnerApplications() {
  const { getApplications, updateApplication } = useAuth();
  const [applications, setApplications] = useState<import("@/lib/auth-context").OwnerApplication[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchApplications = async () => {
    try {
      const data = await getApplications();
      setApplications(data);
    } catch {
      setApplications([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusChange = async (id: number, status: string) => {
    setUpdatingId(id);
    try {
      await updateApplication(id, status);
      setApplications((prev) =>
        prev
          ? prev.map((app) => (app.id === id ? { ...app, status } : app))
          : prev
      );
      toast.success(`Application status updated to ${STATUS_LABELS[status]}`);
    } catch {
      toast.error("Failed to update application status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-dm-serif)" }}>
          Applicants
        </h2>
        <p className="text-sm text-[#7A6150] pb-5">Review and update the status of incoming adoption applications.</p>
        <div className="text-center py-12">
          <p className="text-[#7A6150]">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-dm-serif)" }}>
        Applicants
      </h2>
      <p className="text-sm text-[#7A6150] pb-5">Review and update the status of incoming adoption applications.</p>

      {!applications || applications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-[#7A6150]">No applications yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {applications.map((app) => {
            const isExpanded = expandedId === app.id;
            const statusClass = STATUS_STYLES[app.status] ?? STATUS_STYLES.submitted;

            return (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-[#dabcac] overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-[#C4622D]/10 flex items-center justify-center">
                          <span className="text-[#C4622D] font-bold text-sm">
                            {app.customer_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900" style={{ fontFamily: "var(--font-dm-serif)" }}>
                            {app.customer_name}
                          </h3>
                          <p className="text-xs text-[#7A6150]">
                            Applied for {app.pet_name} · {app.pet_species} {app.pet_breed && `- ${app.pet_breed}`}
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-[#7A6150]/60">{formatDate(app.submitted_at)}</p>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <span className={`px-3 py-1 rounded-full border text-xs font-medium ${statusClass}`}>
                        {STATUS_LABELS[app.status] ?? app.status}
                      </span>

                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        disabled={updatingId === app.id}
                        className="px-3 py-1.5 rounded-lg border border-[#dabcac] bg-[#F2E8DB] text-sm text-[#7A6150] focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 cursor-pointer"
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {STATUS_LABELS[opt]}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => setExpandedId(isExpanded ? null : app.id)}
                        className="flex items-center gap-1 text-xs text-[#7A6150]/60 hover:text-[#C4622D] transition-colors"
                      >
                        {isExpanded ? "Hide" : "View"} answers
                        {isExpanded ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-[#dabcac] space-y-3">
                      {app.answers.length === 0 ? (
                        <p className="text-sm text-[#7A6150]/60 italic">No screening questions for this pet.</p>
                      ) : (
                        app.answers.map((answer, i) => (
                          <div key={i} className="bg-[#F2E8DB] rounded-xl p-3">
                            <p className="text-xs font-medium text-[#7A6150] mb-1">
                              {i + 1}. {answer.question}
                            </p>
                            <p className="text-sm text-gray-900">{answer.answer || <span className="italic text-[#7A6150]/50">No answer</span>}</p>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
