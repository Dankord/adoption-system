"use client";

import {
  Edit,
  Trash2,
  Eye,
} from "lucide-react";

export interface OwnerPet {
  id: number;
  name: string;
  species: string;
  breed: string;
  age: string;
  gender: string;
  status: "Available" | "Under Review" | "Reserved" | "Adopted";
  adoptionFee: number;
  image: string;
  vaccinated: boolean;
  neutered: boolean;
}

interface OwnerPetCardProps {
  pet: OwnerPet;
  onEdit: (pet: OwnerPet) => void;
  onDelete: (pet: OwnerPet) => void;
  onView: (pet: OwnerPet) => void;
}

const STATUS_COLORS: Record<string, string> = {
  Available: "bg-[#E8DDD3] text-[#C4622D] border-[#dabcac]",
  "Under Review": "bg-yellow-50 text-yellow-700 border-yellow-200",
  Reserved: "bg-orange-50 text-orange-700 border-orange-200",
  Adopted: "bg-gray-100 text-gray-500 border-gray-200",
};

export function OwnerPetCard({ pet, onEdit, onDelete, onView }: OwnerPetCardProps) {
  return (
    <div className="group bg-white rounded-2xl border border-[#dabcac] overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col">
      <div className="relative overflow-hidden h-52">
        <img
          src={pet.image}
          alt={pet.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full border text-xs font-medium ${STATUS_COLORS[pet.status]}`}>
          {pet.status}
        </div>
        <div className="absolute top-3 right-3 flex gap-1.5">
          <button
            onClick={(e) => { e.stopPropagation(); onView(pet); }}
            className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors shadow-sm cursor-pointer"
            title="View details"
          >
            <Eye className="w-4 h-4 text-[#7A6150]" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(pet); }}
            className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors shadow-sm cursor-pointer"
            title="Edit pet"
          >
            <Edit className="w-4 h-4 text-[#7A6150]" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(pet); }}
            className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-red-50 transition-colors shadow-sm cursor-pointer"
            title="Delete pet"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-gray-900 font-semibold" style={{ fontFamily: "var(--font-dm-serif)", fontSize: "1.15rem" }}>
              {pet.name}
            </h3>
            <p className="text-[#7A6150] text-xs mt-0.5">{pet.breed} · {pet.age} · {pet.gender}</p>
          </div>
          <div className="text-right">
            <p className="text-[#C4622D] font-semibold text-sm">₱{pet.adoptionFee.toLocaleString()}</p>
            <p className="text-[#7A6150]" style={{ fontSize: "0.65rem" }}>adoption fee</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          <span className="px-2 py-0.5 bg-[#FFFAF4] text-[#7A6150] rounded-full text-xs border border-[#dabcac]">
            {pet.species}
          </span>
          {pet.vaccinated && (
            <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-xs border border-green-200">
              Vaccinated
            </span>
          )}
          {pet.neutered && (
            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs border border-blue-200">
              Neutered
            </span>
          )}
        </div>

        <div className="mt-auto flex gap-2">
          <button
            onClick={() => onView(pet)}
            className="flex-1 py-2 rounded-xl bg-[#C4622D] text-white text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
          >
            View
          </button>
          <button
            onClick={() => onEdit(pet)}
            className="flex-1 py-2 rounded-xl border border-[#dabcac] text-[#7A6150] text-sm font-medium hover:bg-[#FFFAF4] transition-colors cursor-pointer"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
