"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { ROUTES, defaultAuthenticatedPath } from "@/lib/routes";
import api from "@/lib/api";
import { SiteHeader } from "@/components/site-header";
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckIcon, Dog } from "lucide-react"
import ScheduleCard from "./components/ScheduleCard";

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters.").max(32, "Name must be at most 32 characters.").regex(
    /^[A-Za-z][A-Za-z\s.'-]*$/,
    "Name can only contain letters and spaces and must start with a letter."
  ),
  housingType: z.enum(["apartment", "condo", "townHouse", "house", "farmRural"]),
  hasSpace: z.boolean(),
  previousOwner: z.boolean(),
  householdNumber: z.number().int().min(1, "At least 1 person.").max(20, "Household can't be that large."),
  hasPet: z.enum(["yes", "no"]),
  typicalSched: z.enum(["wfh", "parttime", "fulltime", "irregular"]),
})

type FormValues = z.infer<typeof formSchema>

const steps = [
  { key: "step1", label: "Living Situation", title: "Your Living Situation", subtitle: "Tell us about your home." },
  { key: "step2", label: "Household", title: "Household & Pets", subtitle: "About your household and experience." },
  { key: "step3", label: "Schedule", title: "Your Schedule", subtitle: "How's your typical week look?" },
]

export default function OnboardingPage() {
  const { refreshUser, user } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      fullName: "",
      housingType: "house",
      hasSpace: false,
      previousOwner: false,
      householdNumber: 1,
      hasPet: "no",
      typicalSched: "wfh",
    },
  })

  const stepFields: Record<number, (keyof FormValues)[]> = {
    0: ["fullName", "housingType", "hasSpace"],
    1: ["previousOwner", "householdNumber", "hasPet"],
    2: ["typicalSched"],
  }

  const validateStep = async (step: number): Promise<boolean> => {
    const fields = stepFields[step];
    const result = await form.trigger(fields, { shouldFocus: true });
    return result;
  }

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (!isValid) return;
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handleSubmitForm();
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  const handleSubmitForm = async () => {
    const allValid = await form.trigger();
    if (!allValid) return;

    const values = form.getValues();
    const isFarm = values.housingType === "farmRural";
    const housingType = isFarm ? "farm" : values.housingType;

    try {
      await api.post("/profile", {
        profile: {
          customer_name: values.fullName.trim(),
          housing_type: housingType,
          has_space: values.hasSpace,
          previous_owner: values.previousOwner,
          household_number: values.householdNumber,
          has_pets: values.hasPet === "yes",
          typical_sched: values.typicalSched,
        },
      });
      await refreshUser();
      router.replace(defaultAuthenticatedPath(user?.role, true));
    } catch {
      toast.error("Could not save your profile. Please try again.");
    }
  }

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  const housingOptions = [
    { value: "apartment", label: "Apartment" },
    { value: "condo", label: "Condo" },
    { value: "townHouse", label: "Townhouse" },
    { value: "house", label: "House" },
    { value: "farmRural", label: "Farm / Rural" },
  ]

  const scheduleOptions = [
    { value: "wfh", label: "Work from home" },
    { value: "parttime", label: "Part-time away" },
    { value: "fulltime", label: "Full-time away (8h+)" },
    { value: "irregular", label: "Irregular/Shift work" },
  ]

  return (
    <div className="min-h-screen bg-[#FDF6EE]">
      <SiteHeader />
      <main className="max-w-2xl mx-auto px-4 py-12">
        {/* Progress Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-[#7A6150]">
              {steps[currentStep].label}
            </p>
            <p className="text-sm text-[#7A6150]/60">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
          <div className="h-2 bg-[#E8DDD3] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#7A6150] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Step Indicator Dots */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {steps.map((step, index) => (
            <button
              key={step.key}
              type="button"
              onClick={() => {
                const prevFields = stepFields[index];
                let allValid = true;
                for (const field of prevFields) {
                  const fieldState = form.getFieldState(field);
                  if (fieldState.invalid) {
                    allValid = false;
                    break;
                  }
                }
                if (allValid || index <= currentStep) {
                  setCurrentStep(index);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className={`flex items-center gap-2 transition-opacity ${index <= currentStep ? "opacity-100" : "opacity-40 cursor-pointer"}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${index < currentStep
                ? "bg-[#7A6150] text-white"
                : index === currentStep
                  ? "bg-[#7A6150] text-white ring-4 ring-[#7A6150]/20"
                  : "bg-[#E8DDD3] text-[#7A6150]"
                }`}>
                {index < currentStep ? (
                  <CheckIcon className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
              <span className={`text-sm hidden sm:inline ${index === currentStep ? "font-medium text-[#7A6150]" : "text-[#7A6150]/60"
                }`}>
                {step.label}
              </span>
            </button>
          ))}
        </div>

        {/* Form Card */}
        <Card className="border shadow-lg border-[#dabcac] bg-[#FFFAF4]">
          <div className="flex items-center w-full">
            <div>
              <div className="bg-[#ebd0c2] p-3 rounded-full ml-5">
                <Dog className="h-6 w-6 text-[#C4622D]"/>
              </div>
            </div>
            <CardHeader className="ml-0 text-start pb-2 w-full">
            <CardTitle className="text-2xl text-gray-900 font-bold">
              {steps[currentStep].title}
            </CardTitle>
            <CardDescription className="text-s text-[#7A6150]">{steps[currentStep].subtitle}</CardDescription>
          </CardHeader>
          </div>
          <CardContent>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              {/* Step 1: Living Situation */}
              {currentStep === 0 && (
                <FieldGroup>
                  <Controller
                    name="fullName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                        <Input
                          {...field}
                          id="fullName"
                          aria-invalid={fieldState.invalid}
                          placeholder="John Doe"
                          className="bg-[#F2E8DB] p-4"
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    name="housingType"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Housing Type</FieldLabel>
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="grid grid-cols-2 gap-3 mt-1"
                        >
                          {housingOptions.map((opt) => (
                            <div key={opt.value} className="relative">
                              <RadioGroupItem
                                value={opt.value}
                                id={`housing-${opt.value}`}
                                className="peer sr-only"
                              />
                              <label
                                htmlFor={`housing-${opt.value}`}
                                className={`flex flex-col items-center justify-center w-full p-4 rounded-2xl border-2 cursor-pointer transition-all
    ${field.value === opt.value
                                    ? "border-[#C4622D] bg-[#C4622D]/10 text-[#C4622D] shadow-md"
                                    : "border-border bg-[#F2E8DB] hover:border-[#7A6150]/50"
                                  }
  `}
                              >
                                {opt.label}
                              </label>
                            </div>
                          ))}
                        </RadioGroup>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    name="hasSpace"
                    control={form.control}
                    render={({ field, fieldState }) => {
                      const hasSpaceValue = form.watch("hasSpace");

                      return (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Do you have a yard or outdoor space?</FieldLabel>

                          <RadioGroup
                            value={hasSpaceValue ? "yes" : "no"}
                            onValueChange={(val) => {
                              form.setValue("hasSpace", val === "yes", {
                                shouldValidate: true,
                              });
                            }}
                            className="flex gap-3 mt-2"
                          >
                            <label
                              htmlFor="space-yes"
                              className={`flex flex-1 items-center justify-center rounded-lg border px-6 py-3 cursor-pointer transition text-center
              ${hasSpaceValue
                                  ? "border-[#C4622D] bg-[#F2E8DB] text-[#C4622D]"
                                  : "border-border hover:border-[#C4622D]/50"
                                }`}
                            >
                              <RadioGroupItem
                                value="yes"
                                id="space-yes"
                                className="sr-only"
                              />
                              Yes, I do
                            </label>

                            <label
                              htmlFor="space-no"
                              className={`flex flex-1 items-center justify-center rounded-lg border px-6 py-3 cursor-pointer transition text-center
              ${hasSpaceValue === false
                                  ? "border-[#C4622D] bg-[#F2E8DB] text-[#C4622D]"
                                  : "border-border hover:border-[#C4622D]/50"
                                }`}
                            >
                              <RadioGroupItem
                                value="no"
                                id="space-no"
                                className="sr-only"
                              />
                              No space
                            </label>
                          </RadioGroup>

                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      );
                    }}
                  />
                </FieldGroup>
              )}

              {/* Step 2: Household */}
              {currentStep === 1 && (
                <FieldGroup>
                  <Controller
                    name="previousOwner"
                    control={form.control}
                    render={({ field, fieldState }) => {
                      return (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Previous pet ownership experience?</FieldLabel>

                          <RadioGroup
                            value={field.value ? "yes" : "no"}
                            onValueChange={(val) => {
                              form.setValue("previousOwner", val === "yes", {
                                shouldValidate: true,
                              });
                            }}
                            className="flex gap-3 mt-2"
                          >
                            <label
                              htmlFor="prev-yes"
                              className={`flex flex-1 items-center justify-center rounded-lg border px-6 py-3 cursor-pointer transition text-center
              ${field.value === true
                                  ? "border-[#C4622D] bg-[#F2E8DB] text-[#C4622D]"
                                  : "border-border hover:border-[#C4622D]/50"
                                }`}
                            >
                              <RadioGroupItem
                                value="yes"
                                id="prev-yes"
                                className="sr-only"
                              />
                              Yes
                            </label>

                            <label
                              htmlFor="prev-no"
                              className={`flex flex-1 items-center justify-center rounded-lg border px-6 py-3 cursor-pointer transition text-center
              ${field.value === false
                                  ? "border-[#C4622D] bg-[#F2E8DB] text-[#C4622D]"
                                  : "border-border hover:border-[#C4622D]/50"
                                }`}
                            >
                              <RadioGroupItem
                                value="no"
                                id="prev-no"
                                className="sr-only"
                              />
                              No
                            </label>
                          </RadioGroup>

                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      );
                    }}
                  />

                  <Controller
                    name="householdNumber"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Number of people in the household</FieldLabel>
                        <Input
                          {...field}
                          type="number"
                          id="householdNumber"
                          min={1}
                          max={20}
                          aria-invalid={fieldState.invalid}
                          className="bg-[#F2E8DB] p-4"
                          onChange={e => {
                            const val = e.target.value;
                            field.onChange(val === "" ? 0 : parseInt(val, 10));
                          }}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    name="hasPet"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Do you currently have any pets?</FieldLabel>

                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="flex gap-3 mt-2"
                        >
                          <label
                            htmlFor="haspet-yes"
                            className={`flex flex-1 cursor-pointer items-center justify-center rounded-lg border px-6 py-3 transition
            ${field.value === "yes"
                                  ? "border-[#C4622D] bg-[#F2E8DB] text-[#C4622D]"
                                  : "border-border hover:border-[#C4622D]/50"
                              }`}
                          >
                            <RadioGroupItem
                              value="yes"
                              id="haspet-yes"
                              className="sr-only"
                            />
                            Yes
                          </label>

                          <label
                            htmlFor="haspet-no"
                            className={`flex flex-1 cursor-pointer items-center justify-center rounded-lg border px-6 py-3 transition
            ${field.value === "no"
                                  ? "border-[#C4622D] bg-[#F2E8DB] text-[#C4622D]"
                                  : "border-border hover:border-[#C4622D]/50"
                              }`}
                          >
                            <RadioGroupItem
                              value="no"
                              id="haspet-no"
                              className="sr-only"
                            />
                            No
                          </label>
                        </RadioGroup>

                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
              )}

              {/* Step 3: Schedule */}
              {currentStep === 2 && (
                <>
                <FieldGroup>
                  <Controller
                    name="typicalSched"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Your typical work schedule</FieldLabel>
                        <Select {...field} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select your schedule" className="bg-[#F2E8DB] p-4"/>
                          </SelectTrigger>
                          <SelectContent>
                            {scheduleOptions.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </FieldGroup>
                <ScheduleCard />
                </>
              )}
            </form>
          </CardContent>
          <CardFooter className="flex justify-between pt-4">
            {currentStep > 0 ? (
              <Button variant="outline" onClick={handleBack} className="p-5 border border-[#ddc0b1] ">
                Back
              </Button>
            ) : (
              <div />
            )}
            <Button onClick={handleNext} className="bg-[#C4622D] p-5 hover:bg-amber-700">
              {currentStep === steps.length - 1 ? "Complete Profile" : "Continue"}
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
