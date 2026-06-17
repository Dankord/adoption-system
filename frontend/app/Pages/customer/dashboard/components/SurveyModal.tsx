"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

interface SurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  reminder: {
    id: number;
    survey_type: string;
    scheduled_at: string;
    pet_name: string;
    pet_species: string;
    reminder_type: string;
  } | null;
  onSubmit: (reminderId: number, responses: Record<string, string>) => Promise<void>;
}

const WEEK_1_QUESTIONS = [
  { key: "adjusting_well", label: "Is your pet adjusting well to the new home?" },
  { key: "eating_normal", label: "Is your pet eating and drinking normally?" },
  { key: "sleeping_comfortably", label: "Is your pet sleeping comfortably?" },
  { key: "any_concerns", label: "Any concerns or questions?" },
];

const MONTH_1_QUESTIONS = [
  { key: "vet_visit_done", label: "Have you taken your pet for a vet visit?" },
  { key: "pet_health", label: "How would you describe your pet's overall health?" },
  { key: "behavior_changes", label: "Have you noticed any behavior changes?" },
  { key: "additional_notes", label: "Any additional notes for the shelter?" },
];

const MONTH_3_QUESTIONS = [
  { key: "overall_wellbeing", label: "How is your pet's overall well-being?" },
  { key: "bonding_progress", label: "How has the bonding process been going?" },
  { key: "any_issues", label: "Are there any ongoing issues or challenges?" },
  { key: "recommend", label: "Would you recommend this adoption process to others?" },
];

export function SurveyModal({ isOpen, onClose, reminder, onSubmit }: SurveyModalProps) {
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !reminder) return null;

  const questions = reminder.survey_type?.includes("Initial")
    ? WEEK_1_QUESTIONS
    : reminder.survey_type?.includes("1-Month")
    ? MONTH_1_QUESTIONS
    : MONTH_3_QUESTIONS;

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onSubmit(reminder.id, responses);
      setResponses({});
      onClose();
    } catch {
      // silently handle
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setResponses((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <Card className="relative w-full max-w-lg bg-white border-[#dabcac] shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-[#e8ddd3]">
          <div>
            <CardTitle className="text-lg" style={{ fontFamily: "var(--font-dm-serif)" }}>
              {reminder.survey_type || "Care Survey"}
            </CardTitle>
            <p className="text-xs text-[#7A6150] mt-1">
              For {reminder.pet_name} ({reminder.pet_species})
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onClose}
            className="h-8 w-8 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="pt-6 space-y-4">
          {questions.map((q) => (
            <div key={q.key} className="space-y-2">
              <Label className="text-sm font-medium text-gray-800">
                {q.label}
              </Label>
              <Textarea
                placeholder="Type your answer..."
                value={responses[q.key] || ""}
                onChange={(e) => handleInputChange(q.key, e.target.value)}
                className="min-h-[60px] border-[#e8ddd3] focus-visible:border-[#C4622D] focus-visible:ring-[#C4622D]/20"
              />
            </div>
          ))}
        </CardContent>

        <CardFooter className="flex justify-end gap-3 pt-4 border-t border-[#e8ddd3]">
          <Button variant="outline" onClick={onClose} className="rounded-4xl">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-4xl bg-[#C4622D] hover:bg-[#b05525]"
          >
            {isSubmitting ? "Submitting..." : "Submit Survey"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
