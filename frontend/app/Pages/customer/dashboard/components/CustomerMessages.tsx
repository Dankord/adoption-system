"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CustomerMessages = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-dm-serif)" }}>Messages</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>PLaceholder</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#7A6150] text-sm">Placeholder.</p>
            </CardContent>
          </Card>
      </div>
    </div>
  );
};

export default CustomerMessages;
