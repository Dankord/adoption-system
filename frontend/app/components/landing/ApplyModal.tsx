"use client";

import { useState } from "react";
import { X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import api from "@/lib/api";

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  petId: number;
  petName: string;
  questions: Array<{ question: string }>;
  onSubmitted: () => void;
}

export function ApplyModal({ isOpen, onClose, petId, petName, questions, onSubmitted }: ApplyModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleChange = (index: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [index]: value }));
  };

  const handleSubmit = async () => {
    const hasQuestions = questions.length > 0;
    const hasMissingAnswers = hasQuestions && questions.some((_, i) => !answers[i]?.trim());

    if (hasMissingAnswers) {
      toast.error("Please answer all questions before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: Record<string, unknown> = { pet_id: petId };
      if (hasQuestions) {
        payload.answers = questions.map((_, i) => answers[i] ?? "");
      }

      await api.post("/application", payload);

      toast.success("Application submitted successfully!");
      onSubmitted();
      onClose();
    } catch {
      toast.error("Failed to submit application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="border shadow-xl w-full max-w-lg mx-4 bg-[#FFFAF4]">
        <CardHeader className="flex flex-row items-center justify-between border-b border-[#dabcac] pb-0">
          <div>
            <CardTitle style={{ fontFamily: "var(--font-dm-serif)" }}>
              Apply for {petName}
            </CardTitle>
            <CardDescription>
              Answer the owner&apos;s questions to complete your application.
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="size-8 rounded-full"
          >
            <X className="size-4" />
          </Button>
        </CardHeader>

        <CardContent className="pt-6">
          {questions.length === 0 ? (
            <p className="text-sm text-[#7A6150] mb-6 text-center">
              This pet has no screening questions. Submitting will proceed directly to approval.
            </p>
          ) : (
            <div className="space-y-4 mb-6">
              {questions.map((q, i) => (
                <div key={i}>
                  <label className="text-sm font-medium text-[#7A6150] mb-1.5 block">
                    {i + 1}. {q.question}
                  </label>
                  <Input
                    value={answers[i] ?? ""}
                    onChange={(e) => handleChange(i, e.target.value)}
                    placeholder="Your answer..."
                    className="bg-[#F2E8DB]"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-[#dabcac] text-[#7A6150] hover:bg-[#FFFAF4]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-[#C4622D] hover:bg-amber-700 gap-2"
            >
              <Send className="size-4" />
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
