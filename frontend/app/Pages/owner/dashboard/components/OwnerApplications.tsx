"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const OwnerApplications = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-dm-serif)" }}>Applicants</h2>
      <p className="text-s text-[#7A6150] pb-5">Review and update the status of incoming adoption applications.</p>
      <div className="grid grid-cols-1 gap-4">
        {[1, 2, 3].map((item) => (
          <Card key={item} className="w-full">
            <CardHeader>
              <CardTitle>Applicant #{item}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#7A6150] text-sm">Application details will appear here once the backend is connected.</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OwnerApplications;
