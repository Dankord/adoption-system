"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Heart, ArrowRight, CheckCircle2 } from 'lucide-react';
import { petDetailPath } from "@/lib/routes";

export interface Pet {
  id: number;
  name: string;
  species: string;
  breed: string;
  age: string;
  gender: string;
  status: string;
  adoptionFee: number;
  image: string;
  vaccinated: boolean;
  neutered: boolean;
  specialNeeds?: boolean;
  temperament: string[];
}

interface PetCardProps {
  pet: Pet;
}

const STATUS_COLORS: Record<string, string> = {
  Available: 'bg-[#E8DDD3] text-[#C4622D] border-[#dabcac]',
  'Under Review': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  Reserved: 'bg-orange-50 text-orange-700 border-orange-200',
  Adopted: 'bg-gray-100 text-gray-500 border-gray-200',
};

export function PetCard({ pet }: PetCardProps) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="group bg-white rounded-2xl border border-[#dabcac] overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col">
      <div className="relative overflow-hidden h-52">
        <img
          src={pet.image}
          alt={pet.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <button
          onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors shadow-sm"
        >
          <Heart className={`w-4 h-4 transition-colors ${liked ? 'fill-rose-500 text-rose-500' : 'text-[#7A6150]'}`} />
        </button>
        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full border text-xs font-medium ${STATUS_COLORS[pet.status]}`}>
          {pet.status}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-gray-900 font-semibold" style={{ fontFamily: "var(--font-dm-serif)", fontSize: '1.15rem' }}>
              {pet.name}
            </h3>
            <p className="text-[#7A6150] text-xs mt-0.5">{pet.breed} · {pet.age} · {pet.gender}</p>
          </div>
          <div className="text-right">
            <p className="text-[#C4622D] font-semibold text-sm">₱{pet.adoptionFee.toLocaleString()}</p>
            <p className="text-[#7A6150]" style={{ fontSize: '0.65rem' }}>adoption fee</p>
          </div>
        </div>

        {pet.specialNeeds && (
          <div className="mb-2 inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-[#C4622D] border border-[#ddc0b1] rounded-full text-xs w-fit">
            ★ Special Needs
          </div>
        )}

        <div className="flex flex-wrap gap-1.5 mb-3">
          {pet.temperament.slice(0, 3).map(t => (
            <span key={t} className="px-2 py-0.5 bg-[#FFFAF4] text-[#7A6150] rounded-full text-xs border border-[#dabcac]">
              {t}
            </span>
          ))}
        </div>

        {pet.vaccinated && (
          <div className="flex items-center gap-1 text-[#4A7C59] text-xs mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Vaccinated {pet.neutered && '· Neutered'}
          </div>
        )}

        <Link
          href={petDetailPath(pet.id)}
          className="mt-auto w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#C4622D] text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={(e) => {
            if (pet.status === 'Adopted') e.preventDefault();
          }}
        >
          View Details <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
