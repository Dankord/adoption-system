"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { OwnerPetCard, type OwnerPet } from "./OwnerPetCard";
import { AddPetModal } from "./AddPetModal";
import { ViewPetModal } from "./ViewPetModal";
import EditPetModal from "./EditPetModal";
import type { FormValues as AddPetFormValues } from "./AddPetModal";
import { toast } from "sonner";

const OWNER_PET_MAP = (pet: import("@/lib/auth-context").Pet): OwnerPet => ({
  id: pet.id,
  name: pet.name,
  species: pet.species,
  breed: pet.breed,
  age: pet.age,
  gender: pet.gender,
  status: pet.status as OwnerPet["status"],
  adoptionFee: pet.adoption_fee,
  image: pet.image ?? "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=300&fit=crop",
  vaccinated: pet.vaccinated,
  neutered: pet.neutered,
});

const OwnerPetListings = () => {
  const { getPets, deletePet, addPet } = useAuth();
  const [pets, setPets] = useState<OwnerPet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<OwnerPet | null>(null);
  const [apiSelectedPet, setApiSelectedPet] = useState<import("@/lib/auth-context").Pet | null>(null);
  const apiPetsMap = useRef<Map<number, import("@/lib/auth-context").Pet>>(new Map());

  const fetchPets = async () => {
    try {
      const apiPets = await getPets();
      const map = new Map(apiPets.map(p => [p.id, p]));
      apiPetsMap.current = map;
      setPets(apiPets.map(OWNER_PET_MAP));
    } catch {
      setPets([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleEdit = (pet: OwnerPet) => {
    setSelectedPet(pet);
    const apiPet = apiPetsMap.current.get(pet.id);
    setApiSelectedPet(apiPet ?? null);
    setIsEditModalOpen(true);
  };

  const handleDelete = (pet: OwnerPet) => {
    setSelectedPet(pet);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedPet) {
      try {
        await deletePet(selectedPet.id);
        setPets((prev) => prev.filter((p) => p.id !== selectedPet.id));
        toast.success("Pet deleted successfully");
      } catch {
        toast.error("Failed to delete pet");
      } finally {
        setIsDeleteModalOpen(false);
        setSelectedPet(null);
      }
    }
  };

  const handleView = (pet: OwnerPet) => {
    setSelectedPet(pet);
    const apiPet = apiPetsMap.current.get(pet.id);
    setApiSelectedPet(apiPet ?? null);
    setIsViewModalOpen(true);
  };

  const handleAddPet = async () => {
    setIsAddModalOpen(false);
    fetchPets();
    toast.success("Pet added successfully!");
  };

  const handleEditPet = async () => {
    setIsEditModalOpen(false);
    setApiSelectedPet(null);
    fetchPets();
    toast.success("Pet updated successfully");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-dm-serif)" }}>Pet Listings</h2>
          <p className="text-sm text-[#7A6150] pt-1">Manage the pets currently listed at your center.</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C4622D] text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <span className="text-lg leading-none">+</span> Add Pet
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-[#7A6150]">Loading pets...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pets.map((pet) => (
            <OwnerPetCard
              key={pet.id}
              pet={pet}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
          ))}
        </div>
      )}

      {pets.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">🐾</p>
          <p className="text-[#7A6150]">No pets listed yet. Click &quot;Add Pet&quot; to get started.</p>
        </div>
      )}

      <AddPetModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onPetAdded={handleAddPet} />

      <ViewPetModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} pet={apiSelectedPet} />

      <EditPetModal isOpen={isEditModalOpen} onClose={handleEditPet} pet={apiSelectedPet} />

      {isDeleteModalOpen && selectedPet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "var(--font-dm-serif)" }}>
              Delete Pet
            </h3>
            <p className="text-[#7A6150] text-sm mb-6">
              Are you sure you want to remove <strong>{selectedPet.name}</strong> from your listings? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedPet(null);
                }}
                className="px-4 py-2 rounded-lg border border-[#dabcac] text-[#7A6150] hover:bg-[#FFFAF4] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerPetListings;
