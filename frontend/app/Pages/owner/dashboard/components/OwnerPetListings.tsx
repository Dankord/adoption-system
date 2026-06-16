"use client";

import { useState } from "react";
import { OwnerPetCard, type OwnerPet } from "./OwnerPetCard";
import { AddPetModal } from "./AddPetModal";
import { ViewPetModal } from "./ViewPetModal";
import type { FormValues as AddPetFormValues } from "./AddPetModal";

const MOCK_PETS: OwnerPet[] = [
  {
    id: 1,
    name: "Buddy",
    species: "Dog",
    breed: "Golden Retriever",
    age: "2 years",
    gender: "Male",
    status: "Available",
    adoptionFee: 5000,
    image: "https://images.unsplash.com/photo-1552053831-71592a24f6c0?w=400&h=300&fit=crop",
    vaccinated: true,
    neutered: true,
  },
  {
    id: 2,
    name: "Whiskers",
    species: "Cat",
    breed: "Persian",
    age: "1 year",
    gender: "Female",
    status: "Under Review",
    adoptionFee: 3000,
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop",
    vaccinated: true,
    neutered: false,
  },
  {
    id: 3,
    name: "Thumper",
    species: "Rabbit",
    breed: "Holland Lop",
    age: "6 months",
    gender: "Male",
    status: "Available",
    adoptionFee: 2000,
    image: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&h=300&fit=crop",
    vaccinated: false,
    neutered: true,
  },
  {
    id: 4,
    name: "Kiwi",
    species: "Bird",
    breed: "Cockatiel",
    age: "1 year",
    gender: "Female",
    status: "Reserved",
    adoptionFee: 4000,
    image: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=300&fit=crop",
    vaccinated: true,
    neutered: true,
  },
];

const OwnerPetListings = () => {
  const [pets, setPets] = useState<OwnerPet[]>(MOCK_PETS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<OwnerPet | null>(null);

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleEdit = (pet: OwnerPet) => {
    alert(`Edit pet: ${pet.name} - This will be connected to backend.`);
  };

  const handleDelete = (pet: OwnerPet) => {
    setSelectedPet(pet);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedPet) {
      setPets((prev) => prev.filter((p) => p.id !== selectedPet.id));
      setIsDeleteModalOpen(false);
      setSelectedPet(null);
    }
  };

  const handleView = (pet: OwnerPet) => {
    setSelectedPet(pet);
    setIsViewModalOpen(true);
  };

  const handleAddPet = (data: AddPetFormValues) => {
    const newPet: OwnerPet = {
      id: Date.now(),
      name: data.name,
      species: data.species,
      breed: data.breed,
      age: data.age,
      gender: data.gender,
      status: "Under Review",
      adoptionFee: data.adoptionFee,
      image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=300&fit=crop",
      vaccinated: data.vaccinated,
      neutered: data.neutered,
    };
    setPets((prev) => [...prev, newPet]);
    setIsAddModalOpen(false);
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

      {pets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">🐾</p>
          <p className="text-[#7A6150]">No pets listed yet. Click &quot;Add Pet&quot; to get started.</p>
        </div>
      )}

      <AddPetModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={handleAddPet} />

      <ViewPetModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} pet={selectedPet} />

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
