"use client";

import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Home, Users, Dog, Calendar, CircleCheck, CircleX } from "lucide-react";

interface CustomerProfileProps {
  onEdit: () => void;
}

export default function CustomerProfile({ onEdit }: CustomerProfileProps) {
  const { user } = useAuth();
  const customer = user?.customer;

  if (!customer) {
    return (
      <Card className="w-full bg-[#FFFAF4] border-[#dabcac]">
        <CardHeader>
          <CardTitle className="text-[#7A6150]">My Profile</CardTitle>
          <CardDescription>Your profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-[#7A6150]">No profile data available.</p>
        </CardContent>
      </Card>
    );
  }

  const profileFields = [
    {
      icon: User,
      label: "Name",
      value: customer.customer_name || "Not set",
    },
    {
      icon: Mail,
      label: "Email",
      value: user?.email || "Not set",
    },
    {
      icon: Home,
      label: "Housing Type",
      value: customer.housing_type || "Not set",
    },
    {
      icon: Users,
      label: "Household Size",
      value: customer.household_number?.toString() || "Not set",
    },
    {
      icon: Dog,
      label: "Has Pets",
      value: customer.has_pets ? "Yes" : "No",
    },
    {
      icon: Calendar,
      label: "Typical Schedule",
      value: customer.typical_sched || "Not set",
    },
  ];

  const booleanFields = [
    { label: "Has Space for Pet", value: customer.has_space },
    { label: "Previous Owner", value: customer.previous_owner },
  ];

  return (
    <Card className="w-full bg-[#FFFAF4] border-[#dabcac]">
      <CardHeader className="flex flex-row items-center justify-between pb-0">
        <div>
          <CardTitle className="text-[#7A6150]">My Profile</CardTitle>
          <CardDescription>Your profile information</CardDescription>
        </div>
        <Button
          onClick={onEdit}
          className="bg-[#C4622D] hover:bg-amber-700 cursor-pointer"
          size="sm"
        >
          Edit Profile
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-[#EAD8C6] flex items-center justify-center mb-3">
            <User className="w-10 h-10 text-[#7A6150]" />
          </div>
          <h3 className="text-xl font-semibold text-[#7A6150]">
            {customer.customer_name}
          </h3>
          <p className="text-sm text-[#7A6150]/70">{user?.email}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {profileFields.map((field) => {
            const Icon = field.icon;
            return (
              <div
                key={field.label}
                className="flex items-center gap-3 p-3 rounded-lg bg-[#F2E8DB]"
              >
                <Icon className="w-5 h-5 text-[#C4622D] shrink-0" />
                <div>
                  <p className="text-xs text-[#7A6150]/60">{field.label}</p>
                  <p className="text-sm font-medium text-[#7A6150]">{field.value}</p>
                </div>
              </div>
            );
          })}

          {booleanFields.map((field) => (
            <div
              key={field.label}
              className="flex items-center gap-3 p-3 rounded-lg bg-[#F2E8DB]"
            >
              {field.value ? (
                <CircleCheck className="w-5 h-5 text-green-600 shrink-0" />
              ) : (
                <CircleX className="w-5 h-5 text-[#7A6150] shrink-0" />
              )}
              <div>
                <p className="text-xs text-[#7A6150]/60">{field.label}</p>
                <p className="text-sm font-medium text-[#7A6150]">
                  {field.value ? "Yes" : "No"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
