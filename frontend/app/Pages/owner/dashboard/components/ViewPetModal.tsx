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
import { CheckCircle2, XCircle } from "lucide-react";
import type { Pet } from "@/lib/auth-context";

interface ViewPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  pet: Pet | null;
}

const STATUS_STYLES: Record<string, string> = {
  Available: "bg-[#E8DDD3] text-[#C4622D] border-[#dabcac]",
  "Under Review": "bg-yellow-50 text-yellow-700 border-yellow-200",
  Reserved: "bg-orange-50 text-orange-700 border-orange-200",
  Adopted: "bg-gray-100 text-gray-500 border-gray-200",
};

export function ViewPetModal({ isOpen, onClose, pet }: ViewPetModalProps) {
  if (!isOpen || !pet) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="border shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto bg-[#FFFAF4]">
        <CardHeader className="flex flex-row items-center justify-between border-b border-[#dabcac] pb-0 sticky top-0 bg-[#FFFAF4] z-10">
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
            className="size-8 rounded-full cursor-pointer"
          >
            <X className="size-4" />
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="w-full h-56 rounded-xl overflow-hidden bg-[#f5ebe0]">
              <img
                src={pet.image ?? undefined}
                alt={pet.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold" style={{ fontFamily: "var(--font-dm-serif)" }}>{pet.name}</h3>
                <p className="text-sm text-[#7A6150]">{pet.breed} · {pet.species}</p>
              </div>
              <span className={`px-3 py-1 rounded-full border text-xs font-medium ${STATUS_STYLES[pet.status] ?? STATUS_STYLES["Available"]}`}>
                {pet.status}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#F2E8DB] rounded-xl p-3">
                <p className="text-xs text-[#7A6150] mb-0.5">Age</p>
                <p className="text-sm font-medium text-gray-900">{pet.age}</p>
              </div>
              <div className="bg-[#F2E8DB] rounded-xl p-3">
                <p className="text-xs text-[#7A6150] mb-0.5">Gender</p>
                <p className="text-sm font-medium text-gray-900">{pet.gender}</p>
              </div>
              <div className="bg-[#F2E8DB] rounded-xl p-3">
                <p className="text-xs text-[#7A6150] mb-0.5">Vaccinated</p>
                <p className={`text-sm font-medium ${pet.vaccinated ? "text-[#4A7C59]" : "text-[#9CA3AF]"}`}>
                  {pet.vaccinated ? "Yes" : "No"}
                </p>
              </div>
              <div className="bg-[#F2E8DB] rounded-xl p-3">
                <p className="text-xs text-[#7A6150] mb-0.5">Neutered</p>
                <p className={`text-sm font-medium ${pet.neutered ? "text-[#4A7C59]" : "text-[#9CA3AF]"}`}>
                  {pet.neutered ? "Yes" : "No"}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-[#7A6150]">Adoption Fee</span>
              <span className="font-semibold text-[#C4622D] text-lg">₱{pet.adoption_fee.toLocaleString()}</span>
            </div>

            {pet.special_needs && (
              <div>
                <h4 className="text-sm font-medium text-[#7A6150] mb-1">Special Needs</h4>
                <p className="text-sm text-[#7A6150] bg-amber-50 border border-[#ddc0b1] rounded-lg p-3">{pet.special_needs}</p>
              </div>
            )}

            {pet.description && (
              <div>
                <h4 className="text-sm font-medium text-[#7A6150] mb-1">About {pet.name}</h4>
                <p className="text-sm text-[#7A6150] leading-relaxed bg-[#F2E8DB] rounded-lg p-3">{pet.description}</p>
              </div>
            )}

            {pet.temperaments && pet.temperaments.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-[#7A6150] mb-2">Temperament</h4>
                <div className="flex flex-wrap gap-2">
                  {pet.temperaments.map((t) => (
                    <span key={t} className="px-3 py-1 bg-[#FFFAF4] text-[#7A6150] rounded-full text-xs font-medium border border-[#dabcac]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {pet.adoption_questions && pet.adoption_questions.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-[#7A6150] mb-2">Adoption Questions</h4>
                <ul className="space-y-1.5">
                  {pet.adoption_questions.map((q, i) => (
                    <li key={i} className="text-sm text-[#7A6150] flex items-start gap-2">
                      <span className="text-[#C4622D] font-medium shrink-0">{i + 1}.</span>
                      <span>{q.question}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
