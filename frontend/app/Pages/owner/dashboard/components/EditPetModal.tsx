"use client";

import React from 'react'
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { X, Plus, Trash2 } from "lucide-react";
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
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useAuth } from "@/lib/auth-context";
import type { Pet } from "@/lib/auth-context";
import { toast } from "sonner";

const TEMPERAMENT_OPTIONS = [
  "Playful",
  "Friendly",
  "Calm",
  "Energetic",
  "Protective",
  "Gentle",
  "Independent",
  "Loyal",
];

const HOUSING_OPTIONS = [
  "any",
  "apartment-friendly",
  "yard_needed",
  "large_space",
];

const EXPERIENCE_OPTIONS = [
  "first_time_friendly",
  "intermediate",
  "experienced_only",
];

const EXPERIENCE_LABELS: Record<string, string> = {
  first_time_friendly: "First-Time Friendly",
  intermediate: "Intermediate",
  experienced_only: "Experienced Only",
};

const HOUSING_LABELS: Record<string, string> = {
  any: "Any Housing",
  "apartment-friendly": "Apartment Friendly",
  yard_needed: "Yard Needed",
  large_space: "Large Space",
};

const questionItemSchema = z.object({
  question: z.string().min(1, "Question cannot be empty."),
});

export const editFormSchema = z.object({
  name: z.string().min(1, "Pet name is required.").max(64),
  species: z.enum(["Dog", "Cat", "Rabbit", "Bird", "Other"], {
    message: "Please select a species.",
  }),
  breed: z.string().min(1, "Breed is required.").max(64),
  age: z.string().min(1, "Age is required.").max(32),
  gender: z.enum(["Male", "Female"], {
    message: "Please select a gender.",
  }),
  adoptionFee: z
    .number({ message: "Adoption fee must be a number." })
    .min(0, "Adoption fee must be 0 or greater."),
  vaccinated: z.boolean(),
  neutered: z.boolean(),
  specialNeeds: z.string(),
  description: z.string(),
  status: z.enum([
    "Available",
    "Under Review",
    "Reserved",
    "Adopted",
  ]),
  temperament: z.array(z.string()).min(1, "Select at least one temperament."),
  adoptionQuestions: z.array(questionItemSchema).min(0),
  housingPreference: z.string().optional().nullable(),
  goodWithOtherPets: z.boolean().optional().nullable(),
  requiredExperience: z.string().optional().nullable(),
});

export type FormValues = z.infer<typeof editFormSchema>;

interface EditPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  pet: Pet | null;
}

const EditPetModal = ({ isOpen, onClose, pet }: EditPetModalProps) => {
  const { updatePet } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(editFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      species: "Dog",
      breed: "",
      age: "",
      gender: "Male",
      adoptionFee: 0,
      vaccinated: false,
      neutered: false,
      specialNeeds: "",
      description: "",
      status: "Available",
      temperament: [],
      adoptionQuestions: [],
      housingPreference: null,
      goodWithOtherPets: null,
      requiredExperience: null,
    },
  });

  useEffect(() => {
    if (pet) {
      form.reset({
        name: pet.name,
        species: pet.species as "Dog" | "Cat" | "Rabbit" | "Bird" | "Other",
        breed: pet.breed,
        age: pet.age,
        gender: pet.gender as "Male" | "Female",
        adoptionFee: pet.adoption_fee,
        vaccinated: pet.vaccinated,
        neutered: pet.neutered,
        specialNeeds: pet.special_needs ?? "",
        description: pet.description ?? "",
        status: pet.status ?? "Available",
        temperament: pet.temperaments ?? [],
        adoptionQuestions: pet.adoption_questions ?? [],
        housingPreference: pet.housing_preference ?? null,
        goodWithOtherPets: pet.good_with_other_pets ?? null,
        requiredExperience: pet.required_experience ?? null,
      });
    }
  }, [pet, form]);

  const { control } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "adoptionQuestions",
  });

  const handleAddQuestion = () => {
    append({ question: "" });
  };

  const handleRemoveQuestion = (index: number) => {
    remove(index);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await form.trigger();
    if (!isValid || !pet) return;

    setIsSubmitting(true);

    try {
      const data = form.getValues();
      await updatePet(pet.id, {
        name: data.name,
        species: data.species,
        breed: data.breed,
        age: data.age,
        gender: data.gender,
        adoption_fee: data.adoptionFee,
        vaccinated: data.vaccinated,
        neutered: data.neutered,
        special_needs: data.specialNeeds,
        description: data.description ?? "",
        status: data.status,
        temperament: data.temperament,
        adoptionQuestions: data.adoptionQuestions,
        housingPreference: data.housingPreference || undefined,
        goodWithOtherPets: data.goodWithOtherPets || undefined,
        requiredExperience: data.requiredExperience || undefined,
      });
      form.reset();
      onClose();
      toast.success("Pet updated successfully");
    } catch {
      toast.error("Failed to update pet");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="border shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto bg-[#FFFAF4]">
        <CardHeader className="flex flex-row items-center justify-between border-b border-[#dabcac] pb-0">
          <div>
            <CardTitle style={{ fontFamily: "var(--font-dm-serif)" }}>
              Edit Pet
            </CardTitle>
            <CardDescription>
              Update the information of the pet.
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
          <form onSubmit={handleSubmitForm} className="space-y-6">
            <FieldGroup>
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="petName">Pet Name</FieldLabel>
                    <Input
                      {...field}
                      id="petName"
                      placeholder="e.g., Buddy"
                      aria-invalid={fieldState.invalid}
                      className="bg-[#F2E8DB]"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Controller
                  name="species"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Species</FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="bg-[#F2E8DB]">
                          <SelectValue placeholder="Select species" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Dog">Dog</SelectItem>
                          <SelectItem value="Cat">Cat</SelectItem>
                          <SelectItem value="Rabbit">Rabbit</SelectItem>
                          <SelectItem value="Bird">Bird</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="breed"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Breed</FieldLabel>
                      <Input
                        {...field}
                        placeholder="e.g., Golden Retriever"
                        aria-invalid={fieldState.invalid}
                        className="bg-[#F2E8DB]"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Controller
                  name="age"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Age</FieldLabel>
                      <Input
                        {...field}
                        placeholder="e.g., 2 years"
                        aria-invalid={fieldState.invalid}
                        className="bg-[#F2E8DB]"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="gender"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Gender</FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="bg-[#F2E8DB]">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="adoptionFee"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Adoption Fee (₱)</FieldLabel>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        placeholder="0"
                        aria-invalid={fieldState.invalid}
                        className="bg-[#F2E8DB]"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <Controller
                name="status"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Status</FieldLabel>

                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="bg-[#F2E8DB]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="Available">
                          Available
                        </SelectItem>

                        <SelectItem value="Under Review">
                          Under Review
                        </SelectItem>

                        <SelectItem value="Reserved">
                          Reserved
                        </SelectItem>

                        <SelectItem value="Adopted">
                          Adopted
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Field>
                <FieldLabel>Health Status</FieldLabel>
                <div className="flex gap-6">
                  <Controller
                    name="vaccinated"
                    control={control}
                    render={({ field }) => (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <span className="text-sm text-[#7A6150]">
                          Vaccinated
                        </span>
                      </label>
                    )}
                  />
                  <Controller
                    name="neutered"
                    control={control}
                    render={({ field }) => (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <span className="text-sm text-[#7A6150]">
                          Neutered
                        </span>
                      </label>
                    )}
                  />
                </div>
              </Field>

              <Field>
                <FieldLabel>Special Needs</FieldLabel>
                <Controller
                  name="specialNeeds"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      placeholder="Describe the special needs..."
                      rows={2}
                      className="mt-3 w-full rounded-lg border border-transparent bg-[#F2E8DB] px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 resize-none bg-[#F2E8DB]"
                    />
                  )}
                />
              </Field>

              <Field>
                <FieldLabel>About this pet</FieldLabel>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      placeholder="Write a short description about the pet..."
                      rows={3}
                      className="mt-3 w-full rounded-lg border border-transparent bg-[#F2E8DB] px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 resize-none bg-[#F2E8DB]"
                    />
                  )}
                />
              </Field>

              <Field>
                <FieldLabel>Temperament</FieldLabel>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-1">
                  {TEMPERAMENT_OPTIONS.map((option) => (
                    <Controller
                      key={option}
                      name="temperament"
                      control={control}
                      render={({ field, fieldState }) => {
                        const isChecked = field.value.includes(option);
                        return (
                          <label
                            key={option}
                            className={`flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer transition-all text-sm ${isChecked
                              ? "border-[#C4622D] bg-[#C4622D]/10 text-[#C4622D]"
                              : "border-border bg-[#F2E8DB] hover:border-[#7A6150]/50"
                              }`}
                          >
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={(checked) => {
                                const current = field.value || [];
                                if (checked) {
                                  field.onChange([...current, option]);
                                } else {
                                  field.onChange(
                                    current.filter((t: string) => t !== option)
                                  );
                                }
                              }}
                            />
                            <span>{option}</span>
                          </label>
                        );
                      }}
                    />
                  ))}
                </div>
                <Controller
                  name="temperament"
                  control={control}
                  render={({ fieldState }) => (
                    <>
                      {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : null}
                    </>
                  )}
                />
              </Field>

              <Field>
                <FieldLabel>Recommended Housing</FieldLabel>
                <FieldDescription className="text-xs text-[#7A6150]/70 mb-2">
                  What type of home works best for this pet? (Used for matching)
                </FieldDescription>
                <Controller
                  name="housingPreference"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value ?? undefined}
                      onValueChange={(value) => field.onChange(value === "null" ? null : value)}
                    >
                      <SelectTrigger className="bg-[#F2E8DB]">
                        <SelectValue placeholder="Select housing preference" />
                      </SelectTrigger>
                      <SelectContent>
                        {HOUSING_OPTIONS.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {HOUSING_LABELS[opt]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>

              <Field>
                <FieldLabel>Good With Other Pets</FieldLabel>
                <FieldDescription className="text-xs text-[#7A6150]/70 mb-2">
                  Can this pet live with other animals? (Used for matching)
                </FieldDescription>
                <div className="flex gap-6">
                  <Controller
                    name="goodWithOtherPets"
                    control={control}
                    render={({ field }) => (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={field.value === true}
                          onCheckedChange={(checked) => {
                            if (checked === true) field.onChange(true);
                            else if (checked === false) field.onChange(null);
                          }}
                        />
                        <span className="text-sm text-[#7A6150]">Yes, friendly with other pets</span>
                      </label>
                    )}
                  />
                </div>
              </Field>

              <Field>
                <FieldLabel>Experience Level Required</FieldLabel>
                <FieldDescription className="text-xs text-[#7A6150]/70 mb-2">
                  What experience level should the adopter have? (Used for matching)
                </FieldDescription>
                <Controller
                  name="requiredExperience"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value ?? undefined}
                      onValueChange={(value) => field.onChange(value === "null" ? null : value)}
                    >
                      <SelectTrigger className="bg-[#F2E8DB]">
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        {EXPERIENCE_OPTIONS.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {EXPERIENCE_LABELS[opt]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>

              <Field>
                <FieldLabel>Adoption Questions</FieldLabel>
                <FieldDescription className="text-xs text-[#7A6150]/70 mb-3">
                  Add custom questions for adoption applicants.
                </FieldDescription>

                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex gap-2 mb-2 items-start"
                  >
                    <div className="flex-1">
                      <Controller
                        name={`adoptionQuestions.${index}.question`}
                        control={control}
                        render={({ field: questionField, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <Input
                              {...questionField}
                              placeholder={`Question ${index + 1}`}
                              aria-invalid={fieldState.invalid}
                              className="bg-[#F2E8DB] text-sm h-9"
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveQuestion(index)}
                      className="shrink-0 mt-0.5 text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddQuestion}
                  className="mt-2 gap-1.5 border-[#dabcac] text-[#7A6150] hover:bg-[#FFFAF4]"
                >
                  <Plus className="size-4" />
                  Add Question
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>

        <div className="flex justify-end gap-3 p-6 border-t border-[#dabcac]">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-[#dabcac] text-[#7A6150] hover:bg-[#FFFAF4]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitForm}
            disabled={isSubmitting}
            className="bg-[#C4622D] hover:bg-amber-700"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default EditPetModal