"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CustomerPetCare = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-dm-serif)" }}>Pet Care</h2>
      <Card>
        <CardHeader>
          <CardTitle>Pet care</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[#7A6150] text-sm">Pet care</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerPetCare;
