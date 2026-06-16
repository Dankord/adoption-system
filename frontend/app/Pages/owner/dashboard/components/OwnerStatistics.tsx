"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const OwnerStatistics = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-dm-serif)" }}>Statistics</h2>
      <p className="text-s text-[#7A6150] pb-5">An overview of your center&apos;s activity and adoption trends.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Pet Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#7A6150] text-sm">Breakdown will appear here once the backend is connected.</p>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Applications by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#7A6150] text-sm">Application stats will appear here once the backend is connected.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OwnerStatistics;
