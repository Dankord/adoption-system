"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CustomerForYouCard = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-dm-serif)" }}>Pets that match your profile</h2>
      <p className="text-s text-[#7A6150] pb-5">Based on your housing and experience.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4].map((item) => (
          <Card key={item} className="w-full">
            <CardHeader>
              <CardTitle>Favorite #{item}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#7A6150] text-sm">Saved pet details will appear here once the backend is connected.</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CustomerForYouCard;
