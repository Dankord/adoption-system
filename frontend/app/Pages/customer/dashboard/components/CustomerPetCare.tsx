"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SurveyModal } from "./SurveyModal";
import { Calendar, Bell, CheckCircle, Clock, AlertCircle, PawPrint } from "lucide-react";

interface CareReminder {
  id: number;
  application_id: number;
  reminder_type: string;
  survey_type: string;
  status: string;
  scheduled_at: string;
  completed_at: string | null;
  pet_name: string;
  pet_species: string;
  pet_breed: string;
  is_overdue: boolean;
}

const REMINDER_ICONS: Record<string, React.ReactNode> = {
  pending: <Bell className="h-5 w-5 text-[#D4A843]" />,
  sent: <Calendar className="h-5 w-5 text-blue-500" />,
  completed: <CheckCircle className="h-5 w-5 text-[#4A7C59]" />,
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Upcoming",
  sent: "Sent",
  completed: "Completed",
};

const SurveyTypeLabels: Record<string, string> = {
  "Initial Vaccination Check": "1-Week: Initial Vaccination Check",
  "1-Month Vet Visit": "1-Month: Vet Visit",
  "3-Month Well-being Check": "3-Month: Well-being Check",
};

const CustomerPetCare = () => {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<CareReminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<CareReminder | null>(null);

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const res = await api.get("/care-reminders");
        setReminders(res.data.reminders || []);
      } catch {
        setReminders([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.customer) {
      fetchReminders();
    }
  }, [user]);

  const handleOpenSurvey = (reminder: CareReminder) => {
    setSelectedReminder(reminder);
    setModalOpen(true);
  };

  const handleSubmitSurvey = async (reminderId: number, responses: Record<string, string>) => {
    await api.post(`/care-reminders/${reminderId}/survey`, { responses });
    setReminders((prev) =>
      prev.map((r) =>
        r.id === reminderId ? { ...r, status: "completed", completed_at: new Date().toISOString() } : r
      )
    );
  };

  const completedCount = reminders.filter((r) => r.status === "completed").length;
  const upcomingCount = reminders.filter((r) => r.status === "pending" || r.status === "sent").length;

  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-dm-serif)" }}>
          Pet Care
        </h2>
        <div className="text-center py-12">
          <p className="text-[#7A6150]">Loading your pet care reminders...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-dm-serif)" }}>
        Pet Care
      </h2>
      <p className="text-sm text-[#7A6150] pb-5">
        Track your pet care reminders and upcoming surveys.
      </p>

      <div className="flex gap-4 mb-6">
        <Card className="flex-1 bg-white border-[#dabcac]">
          <CardContent className="pt-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D4A843]/10 flex items-center justify-center">
              <Bell className="h-5 w-5 text-[#D4A843]" />
            </div>
            <div>
              <p className="text-2xl font-bold">{upcomingCount}</p>
              <p className="text-xs text-[#7A6150]">Upcoming Reminders</p>
            </div>
          </CardContent>
        </Card>
        <Card className="flex-1 bg-white border-[#dabcac]">
          <CardContent className="pt-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#4A7C59]/10 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-[#4A7C59]" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completedCount}</p>
              <p className="text-xs text-[#7A6150]">Completed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {reminders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <PawPrint className="h-12 w-12 mx-auto text-[#dabcac] mb-3" />
            <p className="text-[#7A6150] font-medium">No care reminders yet</p>
            <p className="text-xs text-[#7A6150]/60 mt-1">
              Care reminders will appear after your adoption is completed.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {reminders
            .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())
            .map((reminder) => (
              <Card
                key={reminder.id}
                className={`bg-white border-[#dabcac] ${
                  reminder.is_overdue && reminder.status !== "completed"
                    ? "border-red-300 shadow-sm"
                    : ""
                }`}
              >
                <CardContent className="pt-6 pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#FDF6EE] flex items-center justify-center flex-shrink-0">
                        {REMINDER_ICONS[reminder.status] || <Calendar className="h-5 w-5 text-[#7A6150]" />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900" style={{ fontFamily: "var(--font-dm-serif)" }}>
                          {SurveyTypeLabels[reminder.survey_type] || reminder.survey_type}
                        </h3>
                        <p className="text-xs text-[#7A6150] mt-0.5">
                          {reminder.pet_name} ({reminder.pet_species}{reminder.pet_breed ? ` · ${reminder.pet_breed}` : ""})
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <Clock className="h-3 w-3 text-[#7A6150]/60" />
                          <p className="text-xs text-[#7A6150]/60">
                            Scheduled for {new Date(reminder.scheduled_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        {reminder.is_overdue && reminder.status !== "completed" && (
                          <div className="flex items-center gap-1 mt-1">
                            <AlertCircle className="h-3 w-3 text-red-500" />
                            <p className="text-xs text-red-500 font-medium">Overdue</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full border text-xs font-medium ${
                          reminder.status === "completed"
                            ? "bg-[#4A7C59]/10 text-[#4A7C59] border-[#4A7C59]/20"
                            : reminder.is_overdue
                            ? "bg-red-50 text-red-600 border-red-200"
                            : "bg-[#E8DDD3] text-[#C4622D] border-[#dabcac]"
                        }`}
                      >
                        {STATUS_LABELS[reminder.status] || reminder.status}
                      </span>

                      {reminder.status === "sent" && (
                        <Button
                          size="sm"
                          onClick={() => handleOpenSurvey(reminder)}
                          className="rounded-4xl bg-[#C4622D] hover:bg-[#b05525] text-xs px-3 h-8"
                        >
                          Take Survey
                        </Button>
                      )}

                      {reminder.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={() => handleOpenSurvey(reminder)}
                          variant="outline"
                          className="rounded-4xl text-xs px-3 h-8 border-[#dabcac] text-[#C4622D] hover:bg-[#FDF6EE]"
                        >
                          Preview
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}

      <SurveyModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedReminder(null);
        }}
        reminder={selectedReminder}
        onSubmit={handleSubmitSurvey}
      />
    </div>
  );
};

export default CustomerPetCare;
