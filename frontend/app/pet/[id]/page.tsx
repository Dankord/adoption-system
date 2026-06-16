"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { SiteHeader } from "@/components/site-header";
import { PetDetail } from "@/app/components/landing/PetDetail";
import { getPetById } from "@/lib/pets";
import { isProfileComplete, normalizeRole } from "@/lib/routes";

export default function PetDetailPage() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const petId = Number(id);
  const pet = getPetById(petId);

  const needsProfile =
    user &&
    normalizeRole(user.role) === "customer" &&
    !isProfileComplete(user.role, user.profile_completed_at);
  const canApply = isAuthenticated && !needsProfile;

  if (!pet) {
    return (
      <div className="min-h-screen bg-[#FDF6EE] flex items-center justify-center">
        <p className="text-[#7A6150] text-lg">Pet not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF6EE]">
      <SiteHeader />
      <PetDetail
        pet={pet}
        isAuthenticated={isAuthenticated}
        canApply={canApply}
        onApply={() => {
          // Adoption flow will be wired up here.
        }}
      />
    </div>
  );
}
