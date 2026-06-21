"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { X, UserPlus } from "lucide-react";
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
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { getApiErrorMessage } from "@/lib/api-error";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  confirmPassword: z.string(),
  name: z.string().min(1, "Name is required."),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

interface AddOwnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddOwnerModal({ isOpen, onClose, onSuccess }: AddOwnerModalProps) {
  const { createAdminUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await createAdminUser({
        email: data.email,
        password: data.password,
        name: data.name,
        role: "owner",
      });
      toast.success("Owner account created successfully");
      onSuccess();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to create owner account"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="border shadow-xl w-full max-w-md mx-4 bg-[#FFFAF4]">
        <CardHeader className="flex flex-row items-center justify-between border-b border-[#dabcac] pb-0">
          <div>
            <CardTitle style={{ fontFamily: "var(--font-dm-serif)" }}>
              Add New Owner
            </CardTitle>
            <CardDescription>
              Create a new owner account for the platform
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Field>
              <FieldLabel>Full Name</FieldLabel>
              <Input
                {...register("name")}
                placeholder="Center name or contact person"
                className="bg-white"
              />
              {errors.name && (
                <FieldError>{errors.name.message}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input
                {...register("email")}
                type="email"
                placeholder="owner@example.com"
                className="bg-white"
              />
              {errors.email && (
                <FieldError>{errors.email.message}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel>Password</FieldLabel>
              <Input
                {...register("password")}
                type="password"
                placeholder="Minimum 8 characters"
                className="bg-white"
              />
              {errors.password && (
                <FieldError>{errors.password.message}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel>Confirm Password</FieldLabel>
              <Input
                {...register("confirmPassword")}
                type="password"
                placeholder="Repeat password"
                className="bg-white"
              />
              {errors.confirmPassword && (
                <FieldError>{errors.confirmPassword.message}</FieldError>
              )}
            </Field>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 cursor-pointer"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#C4622D] hover:bg-[#A8501F] text-white cursor-pointer"
                disabled={isSubmitting || !isValid}
              >
                <UserPlus className="w-4 h-4 mr-1" />
                {isSubmitting ? "Creating..." : "Create Owner"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
