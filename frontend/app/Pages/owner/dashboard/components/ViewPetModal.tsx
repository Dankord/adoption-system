"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { OwnerPet } from "./OwnerPetCard";

interface ViewPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  pet: OwnerPet | null;
}

export function ViewPetModal({ isOpen, onClose, pet }: ViewPetModalProps) {
  if (!isOpen || !pet) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="border shadow-xl w-full max-w-md mx-4 bg-[#FFFAF4]">
        <CardHeader className="flex flex-row items-center justify-between border-b border-[#dabcac] pb-0">
          <div>
            <CardTitle style={{ fontFamily: "var(--font-dm-serif)" }}>
              Pet Details
            </CardTitle>
            <CardDescription>
              Information about {pet.name}
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
          <div className="flex flex-col items-center gap-4">
            <div className="w-full h-48 rounded-xl overflow-hidden bg-[#f5ebe0] flex items-center justify-center">
              <img
                src={pet.image}
                alt={pet.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="w-full space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#7A6150]">Name</span>
                <span className="font-medium" style={{ fontFamily: "var(--font-dm-serif)" }}>{pet.name}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-[#7A6150]">Species</span>
                <span className="font-medium">{pet.species}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-[#7A6150]">Breed</span>
                <span className="font-medium">{pet.breed}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-[#7A6150]">Age</span>
                <span className="font-medium">{pet.age}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-[#7A6150]">Gender</span>
                <span className="font-medium">{pet.gender}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-[#7A6150]">Status</span>
                <span className={`px-2 py-0.5 rounded-full border text-xs font-medium ${
                  pet.status === "Available"
                    ? "bg-[#E8DDD3] text-[#C4622D] border-[#dabcac]"
                    : pet.status === "Under Review"
                    ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                    : pet.status === "Reserved"
                    ? "bg-orange-50 text-orange-700 border-orange-200"
                    : "bg-gray-100 text-gray-500 border-gray-200"
                }`}>
                  {pet.status}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-[#7A6150]">Adoption Fee</span>
                <span className="font-semibold text-[#C4622D]">₱{pet.adoptionFee.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-[#7A6150]">Vaccinated</span>
                <span className="font-medium text-green-600">{pet.vaccinated ? "Yes" : "No"}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-[#7A6150]">Neutered</span>
                <span className="font-medium text-blue-600">{pet.neutered ? "Yes" : "No"}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
