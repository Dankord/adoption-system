"use client";

import { useState } from 'react';
import { Search, SlidersHorizontal, Filter, X } from 'lucide-react';
import { PetCard, type Pet } from './PetCard';

const SPECIES_OPTIONS = ['All', 'Dog', 'Cat', 'Rabbit', 'Bird'];
const TEMPERAMENT_OPTIONS = ['Friendly', 'Playful', 'Calm', 'Energetic', 'Shy', 'Gentle', 'Loyal', 'Curious', 'Independent', 'Intelligent'];

interface AvailablePetsProps {
  pets: Pet[];
}

export function AvailablePets({ pets }: AvailablePetsProps) {
  const [search, setSearch] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState('All');
  const [selectedGender, setSelectedGender] = useState('All');
  const [vaccinated, setVaccinated] = useState(false);
  const [neutered, setNeutered] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTemps, setSelectedTemps] = useState<string[]>([]);

  const filtered = pets.filter(p => {
    if (p.status === 'Adopted') return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.breed.toLowerCase().includes(search.toLowerCase())) return false;
    if (selectedSpecies !== 'All' && p.species !== selectedSpecies) return false;
    if (selectedGender !== 'All' && p.gender !== selectedGender) return false;
    if (vaccinated && !p.vaccinated) return false;
    if (neutered && !p.neutered) return false;
    if (selectedTemps.length > 0 && !selectedTemps.some(t => p.temperament.includes(t))) return false;
    return true;
  });

  const toggleTemp = (t: string) => setSelectedTemps(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  return (
    <div id="pet-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-gray-900 font-bold" style={{ fontFamily: "var(--font-dm-serif)", fontSize: '1.6rem' }}>
            Available Pets
          </h2>
          <p className="text-[#7A6150] text-sm">{filtered.length} pet{filtered.length !== 1 ? 's' : ''} found</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A6150]/60" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or breed…"
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-[#F2E8DB] border border-[#dabcac] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 text-gray-900 placeholder:text-[#7A6150]/60"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-colors ${showFilters ? 'bg-[#C4622D] text-white border-[#C4622D]' : 'bg-white text-[#7A6150] border-[#dabcac] hover:bg-[#F2E8DB]'}`}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {(selectedTemps.length > 0 || vaccinated || neutered || selectedGender !== 'All') && (
              <span className="w-5 h-5 bg-white text-[#C4622D] rounded-full flex items-center justify-center" style={{ fontSize: '0.65rem' }}>
                {selectedTemps.length + (vaccinated ? 1 : 0) + (neutered ? 1 : 0) + (selectedGender !== 'All' ? 1 : 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide">
        {SPECIES_OPTIONS.map(s => (
          <button
            key={s}
            onClick={() => setSelectedSpecies(s)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedSpecies === s ? 'bg-[#C4622D] text-white' : 'bg-white border border-[#dabcac] text-[#7A6150] hover:bg-[#F2E8DB]'}`}
          >
            {s === 'All' ? '🐾 All' : s === 'Dog' ? '🐕 Dogs' : s === 'Cat' ? '🐈 Cats' : s === 'Rabbit' ? '🐇 Rabbits' : '🦜 Birds'}
          </button>
        ))}
      </div>

      {showFilters && (
        <div className="mb-6 p-4 bg-white border border-[#dabcac] rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2"><SlidersHorizontal className="w-4 h-4 text-[#C4622D]" /> Filter Options</h3>
            <button onClick={() => { setSelectedGender('All'); setVaccinated(false); setNeutered(false); setSelectedTemps([]); }} className="cursor-pointer text-xs text-[#7A6150] hover:text-[#C4622D] transition-colors">Clear all</button>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#7A6150] mb-2">Gender</label>
              <div className="flex gap-2">
                {['All', 'Male', 'Female'].map(g => (
                  <button key={g} onClick={() => setSelectedGender(g)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedGender === g ? 'bg-[#C4622D] text-white' : 'bg-[#F2E8DB] text-[#7A6150] hover:bg-[#e8d5c5]'}`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#7A6150] mb-2">Health</label>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={vaccinated} onChange={e => setVaccinated(e.target.checked)} className="accent-[#C4622D]" />
                  <span className="text-xs text-[#7A6150]">Vaccinated only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={neutered} onChange={e => setNeutered(e.target.checked)} className="accent-[#C4622D]" />
                  <span className="text-xs text-[#7A6150]">Neutered/Spayed only</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#7A6150] mb-2">Temperament</label>
              <div className="flex flex-wrap gap-1.5">
                {TEMPERAMENT_OPTIONS.slice(0, 6).map(t => (
                  <button
                    key={t}
                    onClick={() => toggleTemp(t)}
                    className={`px-2 py-1 rounded-full text-xs transition-colors ${selectedTemps.includes(t) ? 'bg-[#C4622D] text-white' : 'bg-[#F2E8DB] text-[#7A6150] hover:bg-[#e8d5c5]'}`}
                  >
                    {selectedTemps.includes(t) && <X className="w-2.5 h-2.5 inline mr-0.5" />}{t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🐾</div>
          <h3 className="text-gray-900 font-semibold mb-2" style={{ fontFamily: "var(--font-dm-serif)" }}>No pets found</h3>
          <p className="text-[#7A6150] text-sm">Try adjusting your filters or search term.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(pet => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      )}
    </div>
  );
}
