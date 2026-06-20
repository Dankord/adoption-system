"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle, Heart, Scale, MessageCircle } from "lucide-react";
import {
  ROUTES,
  registrationWithCallback,
  signinWithCallback,
} from "@/lib/routes";

export interface Pet {
  id: number;
  name: string;
  species: string;
  breed: string;
  age: string;
  gender: string;
  color?: string;
  weight?: string;
  status: "Available" | "Under Review" | "Reserved" | "Adopted";
  adoptionFee: number;
  image: string;
  vaccinated: boolean;
  neutered: boolean;
  specialNeeds?: boolean;
  temperament: string[];
  description: string;
  requirements: string[];
  customQuestions: string[];
  adoptionQuestions?: Array<{ question: string }>;
}

interface PetDetailProps {
  pet: Pet;
  isAuthenticated?: boolean;
  canApply?: boolean;
  onApply?: () => void;
  ownerId?: number | null;
  onMessageOwner?: () => void;
  userRole?: string;
}

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  Available: { bg: "bg-[#E8DDD3] border-[#dabcac]", text: "text-[#C4622D]", dot: "bg-[#C4622D]" },
  "Under Review": { bg: "bg-yellow-50 border-yellow-200", text: "text-yellow-700", dot: "bg-yellow-500" },
  Reserved: { bg: "bg-orange-50 border-orange-200", text: "text-orange-700", dot: "bg-orange-500" },
  Adopted: { bg: "bg-gray-100 border-gray-200", text: "text-gray-500", dot: "bg-gray-400" },
};

function ApplySection({
  pet,
  isAuthenticated,
  canApply,
  onApply,
  ownerId,
  onMessageOwner,
  userRole,
}: PetDetailProps) {
  const petPath = `/pet/${pet.id}`;
  const isAvailable = pet.status === "Available";
  const isOwnerOrAdmin = userRole === "owner" || userRole === "admin";

  if (!isAvailable) {
    return (
      <div className="space-y-2">
        <button
          disabled
          className="w-full py-3 rounded-xl bg-[#C4622D] text-white font-medium text-sm opacity-50 cursor-not-allowed"
        >
          Not Available for Adoption
        </button>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="space-y-2">
        <Link
          href={signinWithCallback(petPath)}
          className="w-full py-3 rounded-xl bg-[#C4622D] text-white font-medium text-sm hover:opacity-90 transition-opacity flex items-center justify-center"
        >
          Sign In to Apply
        </Link>
        <Link
          href={registrationWithCallback(petPath)}
          className="w-full py-3 rounded-xl border border-[#C4622D] text-[#C4622D] font-medium text-sm hover:bg-[#C4622D]/5 transition-colors flex items-center justify-center"
        >
          Register to Apply
        </Link>
      </div>
    );
  }

  if (!canApply) {
    return (
      <div className="space-y-2">
        <Link
          href={ROUTES.onboarding}
          className="w-full py-3 rounded-xl bg-[#C4622D] text-white font-medium text-sm hover:opacity-90 transition-opacity flex items-center justify-center"
        >
          Complete Profile to Apply
        </Link>
      </div>
    );
  }

  if (isOwnerOrAdmin) {
    return null;
  }

  return (
    <div className="space-y-2">
      <button
        onClick={onApply}
        className="w-full py-3 rounded-xl bg-[#C4622D] text-white font-medium text-sm hover:opacity-90 transition-opacity"
      >
        Apply for Adoption
      </button>
      {ownerId && (
        <button
          onClick={onMessageOwner}
          className="w-full py-3 rounded-xl border border-[#C4622D] text-[#C4622D] font-medium text-sm hover:bg-[#C4622D]/5 transition-opacity flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          Message Owner
        </button>
      )}
    </div>
  );
}

export function PetDetail({
  pet,
  isAuthenticated = false,
  canApply = false,
  onApply,
  ownerId = null,
  onMessageOwner,
  userRole,
}: PetDetailProps) {
  const ss = STATUS_STYLES[pet.status] ?? STATUS_STYLES["Available"];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href={ROUTES.home}
        className="flex items-center gap-2 text-[#7A6150] hover:text-[#C4622D] transition-colors mb-8 text-sm w-fit"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Browse
      </Link>

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-5">
          <div className="relative rounded-2xl overflow-hidden shadow-md">
            <img src={pet.image} alt={pet.name} className="w-full h-72 sm:h-96 object-cover" />
            <div className={`absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${ss.bg} ${ss.text}`}>
              <span className={`w-2 h-2 rounded-full ${ss.dot}`} />
              {pet.status}
            </div>
            <button className="absolute top-4 right-4 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm">
              <Heart className="w-5 h-5 text-[#7A6150]" />
            </button>
          </div>

          {pet.requirements.length > 0 && (
            <div className="bg-white border border-[#dabcac] rounded-2xl p-5">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#C4622D]" /> Adoption Requirements
              </h3>
              <ul className="space-y-2">
                {pet.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#7A6150]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C4622D] shrink-0 mt-0.5" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {pet.customQuestions.length > 0 && (
            <div className="bg-[#C4622D]/5 border border-[#C4622D]/15 rounded-2xl p-5">
              <h3 className="text-sm font-semibold mb-3 text-[#7A6150]">
                Screening Questions Preview
              </h3>
              <p className="text-xs text-[#7A6150]/60 mb-3">
                You&apos;ll answer these when you apply for {pet.name}:
              </p>
              <ul className="space-y-2">
                {pet.customQuestions.map((q, i) => (
                  <li key={i} className="text-sm text-[#7A6150] flex items-start gap-2">
                    <span className="text-[#C4622D] font-medium shrink-0">{i + 1}.</span>
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white border border-[#dabcac] rounded-2xl p-6">
            <div className="mb-4">
              <h1
                className="font-bold text-gray-900"
                style={{ fontFamily: "var(--font-dm-serif)", fontSize: "2rem" }}
              >
                {pet.name}
              </h1>
              <p className="text-[#7A6150] text-sm">
                {pet.breed} · {pet.species}
              </p>
              {pet.specialNeeds && (
                <span className="inline-block mt-2 px-3 py-1 bg-amber-50 text-[#C4622D] border border-[#ddc0b1] rounded-full text-xs font-medium">
                  ★ Special Needs Pet
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { label: "Age", value: pet.age },
                { label: "Gender", value: pet.gender },
                ...(pet.color ? [{ label: "Color", value: pet.color }] : []),
                ...(pet.weight ? [{ label: "Weight", value: pet.weight }] : []),
              ].map((f) => (
                <div key={f.label} className="bg-[#F2E8DB] rounded-xl p-3">
                  <p className="text-xs text-[#7A6150] mb-0.5">{f.label}</p>
                  <p className="text-sm font-medium text-gray-900">{f.value}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 mb-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#7A6150] flex items-center gap-1.5">
                  {pet.vaccinated ? (
                    <CheckCircle2 className="w-4 h-4 text-[#4A7C59]" />
                  ) : (
                    <XCircle className="w-4 h-4 text-[#9CA3AF]" />
                  )}
                  Vaccinated
                </span>
                <span
                  className={`text-xs font-medium ${pet.vaccinated ? "text-[#4A7C59]" : "text-[#9CA3AF]"}`}
                >
                  {pet.vaccinated ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#7A6150] flex items-center gap-1.5">
                  {pet.neutered ? (
                    <CheckCircle2 className="w-4 h-4 text-[#4A7C59]" />
                  ) : (
                    <XCircle className="w-4 h-4 text-[#9CA3AF]" />
                  )}
                  Neutered / Spayed
                </span>
                <span
                  className={`text-xs font-medium ${pet.neutered ? "text-[#4A7C59]" : "text-[#9CA3AF]"}`}
                >
                  {pet.neutered ? "Yes" : "No"}
                </span>
              </div>
            </div>

            <div className="mb-5">
              <h3 className="text-xs font-medium text-[#7A6150] uppercase tracking-wide mb-2">
                Temperament
              </h3>
              <div className="flex flex-wrap gap-2">
                {pet.temperament.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 bg-[#FFFAF4] text-[#7A6150] rounded-full text-xs font-medium border border-[#dabcac]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-[#dabcac] pt-4 mb-5">
              <h3 className="text-xs font-medium text-[#7A6150] uppercase tracking-wide mb-2">
                About {pet.name}
              </h3>
              <p className="text-sm text-[#7A6150] leading-relaxed">{pet.description}</p>
            </div>

            <div className="border-t border-[#dabcac] pt-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-[#7A6150]">Adoption Fee</span>
                <span
                  className="text-[#C4622D] font-semibold"
                  style={{ fontFamily: "var(--font-dm-serif)", fontSize: "1.25rem" }}
                >
                  ₱{pet.adoptionFee.toLocaleString()}
                </span>
              </div>

              <ApplySection
                pet={pet}
                isAuthenticated={isAuthenticated}
                canApply={canApply}
                onApply={onApply}
                ownerId={ownerId}
                onMessageOwner={onMessageOwner}
                userRole={userRole}
              />
            </div>
          </div>

          <div className="bg-white border border-[#dabcac] rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#C4622D]/10 flex items-center justify-center">
                <Scale className="w-5 h-5 text-[#C4622D]" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Adoption Fee Covers</p>
                <p className="text-xs text-[#7A6150]">What&apos;s included</p>
              </div>
            </div>
            <ul className="space-y-1.5">
              {[
                "Initial vet health certificate",
                "Up-to-date vaccinations",
                "Microchipping",
                "Deworming treatment",
                "Post-adoption follow-up support",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-xs text-[#7A6150]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#4A7C59] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
