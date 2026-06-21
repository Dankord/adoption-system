"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/auth-context";
import { getApiErrorMessage } from "@/lib/api-error";
import { toast } from "sonner";

const editProfileSchema = z.object({
  customer_name: z.string().min(1, "Name is required.").max(255),
  housing_type: z.enum(["Apartment", "Condominium", "House with Yard", "House without Yard", "Other"], {
    message: "Please select a housing type.",
  }),
  has_space: z.boolean(),
  previous_owner: z.boolean(),
  household_number: z.number().min(1, "Must be at least 1."),
  has_pets: z.boolean(),
  typical_sched: z.string().min(1, "Schedule is required."),
});

type EditFormValues = {
  customer_name: string;
  housing_type: "Apartment" | "Condominium" | "House with Yard" | "House without Yard" | "Other";
  has_space: boolean;
  previous_owner: boolean;
  household_number: number;
  has_pets: boolean;
  typical_sched: string;
};

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const { user, updateProfile, refreshUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const customer = user?.customer;

  const form = useForm<EditFormValues>({
    resolver: zodResolver(editProfileSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      customer_name: customer?.customer_name || "",
      housing_type: (customer?.housing_type as EditFormValues["housing_type"]) || "Apartment",
      has_space: customer?.has_space ?? false,
      previous_owner: customer?.previous_owner ?? false,
      household_number: customer?.household_number || 1,
      has_pets: customer?.has_pets ?? false,
      typical_sched: customer?.typical_sched || "",
    },
  });

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await form.trigger();
    if (!isValid) return;

    setIsSubmitting(true);
    const data = form.getValues();

    try {
      await updateProfile({
        customer_name: data.customer_name,
        housing_type: data.housing_type,
        has_space: data.has_space,
        previous_owner: data.previous_owner,
        household_number: data.household_number,
        has_pets: data.has_pets,
        typical_sched: data.typical_sched,
      });

      await refreshUser();
      toast.success("Profile updated successfully!");
      form.reset();
      onClose();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to update profile."));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="border shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto bg-[#FFFAF4]">
        <CardHeader className="flex flex-row items-center justify-between border-b border-[#dabcac] pb-0">
          <div>
            <CardTitle style={{ fontFamily: "var(--font-dm-serif)" }}>
              Edit Profile
            </CardTitle>
            <CardDescription>
              Update your profile information.
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="size-8 rounded-full cursor-pointer"
          >
            <X className="size-4" />
          </Button>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmitForm} className="space-y-6">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="customer_name">Full Name</FieldLabel>
                <Input
                  {...form.register("customer_name")}
                  id="customer_name"
                  placeholder="Your full name"
                  className="bg-[#F2E8DB]"
                />
                {form.formState.errors.customer_name && (
                  <FieldError errors={[form.formState.errors.customer_name]} />
                )}
              </Field>

              <Field>
                <FieldLabel>Housing Type</FieldLabel>
                <Select
                  value={form.watch("housing_type")}
                  onValueChange={(val) => form.setValue("housing_type", val as EditFormValues["housing_type"])}
                >
                  <SelectTrigger className="bg-[#F2E8DB]">
                    <SelectValue placeholder="Select housing type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Apartment">Apartment</SelectItem>
                    <SelectItem value="Condominium">Condominium</SelectItem>
                    <SelectItem value="House with Yard">House with Yard</SelectItem>
                    <SelectItem value="House without Yard">House without Yard</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.housing_type && (
                  <FieldError errors={[form.formState.errors.housing_type]} />
                )}
              </Field>

              <Field>
                <FieldLabel>Household Size</FieldLabel>
                <Input
                  {...form.register("household_number", { valueAsNumber: true })}
                  type="number"
                  min={1}
                  placeholder="Number of people"
                  className="bg-[#F2E8DB]"
                />
                {form.formState.errors.household_number && (
                  <FieldError errors={[form.formState.errors.household_number]} />
                )}
              </Field>

              <Field>
                <FieldLabel>Typical Schedule</FieldLabel>
                <Input
                  {...form.register("typical_sched")}
                  placeholder="e.g., Away until 6 PM"
                  className="bg-[#F2E8DB]"
                />
                {form.formState.errors.typical_sched && (
                  <FieldError errors={[form.formState.errors.typical_sched]} />
                )}
              </Field>

              <div className="space-y-3">
                <FieldLabel>Details</FieldLabel>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={form.watch("has_space")}
                    onCheckedChange={(checked) => form.setValue("has_space", checked === true)}
                  />
                  <span className="text-sm text-[#7A6150]">I have space for a pet</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={form.watch("previous_owner")}
                    onCheckedChange={(checked) => form.setValue("previous_owner", checked === true)}
                  />
                  <span className="text-sm text-[#7A6150]">I have owned pets before</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={form.watch("has_pets")}
                    onCheckedChange={(checked) => form.setValue("has_pets", checked === true)}
                  />
                  <span className="text-sm text-[#7A6150]">I currently have pets</span>
                </label>
              </div>
            </FieldGroup>
          </form>
        </CardContent>

        <div className="flex justify-end gap-3 p-6 border-t border-[#dabcac]">
          <Button
             variant="outline"
             onClick={onClose}
             className="border-[#dabcac] text-[#7A6150] hover:bg-[#FFFAF4] cursor-pointer"
           >
             Cancel
           </Button>
           <Button
             onClick={handleSubmitForm}
            disabled={isSubmitting}
            className="bg-[#C4622D] hover:bg-amber-700 cursor-pointer"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
