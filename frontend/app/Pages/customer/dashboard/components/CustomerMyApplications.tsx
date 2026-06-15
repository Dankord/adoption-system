"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  { label: "Submitted", status: "completed" },
  { label: "Screening Passed", status: "completed" },
  { label: "Interview Schedule", status: "current" },
  { label: "Approved", status: "pending" },
  { label: "Rejected", status: "pending" },
  { label: "Completed", status: "pending" },
];

const CustomerMyApplication = () => {
  const statusStyles: Record<string, { line: string; dot: string; text: string }> = {
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

  return (
    <div>
      <div className="gap-4">
        <Card className="w-full">
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="bg-[#F2E8DB] h-15 w-15"></div>
                <div>
                  <h3>Bruno</h3>
                  <p>Submitted 2026-06-02</p>
                </div>
              </div>
              <div className="">
                <div className="bg-[#d5ddd7] text-[#4A7C59] border border-[#4A7C59] rounded-full p-2">
                  <h3 className="text-xs">Screening Passed</h3>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <div className="relative flex items-center justify-between">
                {/* Connecting line background */}
                <div className="absolute top-[50%] left-0 w-full h-0.5 bg-[#D1D5DB] -translate-y-1/2 rounded"></div>

                {steps.map((step, index) => {
                  const style = statusStyles[step.status];
                  const isLast = index === steps.length - 1;
                  return (
                    <div key={index} className="relative flex flex-col items-center z-10">
                      <div className={`w-6 h-6 rounded-full ${style.dot} transition-colors`}></div>
                      <span className={`mt-2 text-xs ${style.text}`}>{step.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-center p-5">
              <div className="bg-[#FAF5FF] border border-[#E9D4FF] rounded-lg p-2 flex items-center justify-center max-w-fit">
                <p className="text-s">Interview Scheduled: 2026-06-14</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerMyApplication;
