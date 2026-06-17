"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { SiteHeader } from "@/components/site-header";
import { PetDetail } from "@/app/components/landing/PetDetail";
import { PetService, mapApiPetToDisplay } from "@/lib/pet-service";
import { isProfileComplete, normalizeRole } from "@/lib/routes";

export default function PetDetailPage() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const petId = Number(id);
  const [pet, setPet] = useState<ReturnType<typeof mapApiPetToDisplay> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const apiPet = await PetService.getOnePublic(petId);
        setPet(mapApiPetToDisplay(apiPet));
      } catch {
        setPet(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [petId]);

  const needsProfile =
    user &&
    normalizeRole(user.role) === "customer" &&
    !isProfileComplete(user.role, user.profile_completed_at);
  const canApply = isAuthenticated && !needsProfile;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF6EE] flex items-center justify-center">
        <p className="text-[#7A6150] text-lg">Loading...</p>
      </div>
    );
  }

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
