"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { SiteHeader, dashboardHrefForUser } from "@/components/site-header";
import { ROUTES } from "@/lib/routes";

export default function LandingPage() {
  const { user, isAuthenticated, isLoading } = useAuth();

  const dashboardHref =
    isAuthenticated && user
      ? dashboardHrefForUser(user.role, Boolean(user.profile_completed_at))
      : ROUTES.signin;

  return (
    import { useState } from 'react';
import { Search, SlidersHorizontal, Heart, ArrowRight, CheckCircle2, X, Filter, ClipboardList, Home } from 'lucide-react';
import { PETS, type Pet, type User } from './data';

interface HomePageProps {
  onNavigate: (page: string, data?: unknown) => void;
  currentUser: User | null;
}

const SPECIES_OPTIONS = ['All', 'Dog', 'Cat', 'Rabbit', 'Bird'];
const TEMPERAMENT_OPTIONS = ['Friendly', 'Playful', 'Calm', 'Energetic', 'Shy', 'Gentle', 'Loyal', 'Curious', 'Independent', 'Intelligent'];

const STATUS_COLORS: Record<string, string> = {
  Available: 'bg-accent/10 text-accent border-accent/20',
  'Under Review': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Reserved: 'bg-orange-100 text-orange-700 border-orange-200',
  Adopted: 'bg-gray-100 text-gray-500 border-gray-200',
};

function PetCard({ pet, onView }: { pet: Pet; onView: (pet: Pet) => void }) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex flex-col">
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
          <Heart className={`w-4 h-4 transition-colors ${liked ? 'fill-rose-500 text-rose-500' : 'text-muted-foreground'}`} />
        </button>
        <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full border text-xs font-medium ${STATUS_COLORS[pet.status]}`}>
          {pet.status}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-foreground font-semibold" style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.15rem' }}>
              {pet.name}
            </h3>
            <p className="text-muted-foreground text-xs mt-0.5">{pet.breed} · {pet.age} · {pet.gender}</p>
          </div>
          <div className="text-right">
            <p className="text-primary font-semibold text-sm">₱{pet.adoptionFee.toLocaleString()}</p>
            <p className="text-muted-foreground" style={{ fontSize: '0.65rem' }}>adoption fee</p>
          </div>
        </div>

        {pet.specialNeeds && (
          <div className="mb-2 inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs w-fit">
            ★ Special Needs
          </div>
        )}

        <div className="flex flex-wrap gap-1.5 mb-3">
          {pet.temperament.slice(0, 3).map(t => (
            <span key={t} className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full text-xs">
              {t}
            </span>
          ))}
        </div>

        {pet.vaccinated && (
          <div className="flex items-center gap-1 text-accent text-xs mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Vaccinated {pet.neutered && '· Neutered'}
          </div>
        )}

        <button
          onClick={() => onView(pet)}
          className="mt-auto w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={pet.status === 'Adopted'}
        >
          View Details <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function HomePage({ onNavigate, currentUser }: HomePageProps) {
  const [search, setSearch] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState('All');
  const [selectedGender, setSelectedGender] = useState('All');
  const [vaccinated, setVaccinated] = useState(false);
  const [neutered, setNeutered] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTemps, setSelectedTemps] = useState<string[]>([]);

  const filtered = PETS.filter(p => {
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
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden bg-card border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 text-center">

          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
            🐾 Community Adoption Platform
          </span>

          {/* Headline */}
          <h1 className="text-primary mb-3" style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: '1.2', fontStyle: 'italic' }}>
            Every pet deserves a loving home
          </h1>

          {/* Decorative sub-heading */}
          <p className="text-foreground font-medium mb-8 flex items-center justify-center gap-2 text-sm">
            <span className="text-primary">✦</span>
            A Life Changed Through Adoption
            <span className="text-primary">✦</span>
          </p>

          {/* Before / After card */}
          <div className="relative flex items-stretch gap-0 rounded-2xl overflow-hidden shadow-lg border border-border mb-8 mx-auto max-w-2xl">
            {/* BEFORE */}
            <div className="flex-1 relative">
              <img
                src="https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=500&h=320&fit=crop&auto=format"
                alt="Stray dog before adoption"
                className="w-full h-52 sm:h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute top-3 left-3">
                <span className="px-2 py-1 bg-black/60 text-white rounded-lg text-xs font-semibold uppercase tracking-wide">Before</span>
                <p className="text-white/80 text-xs mt-1 ml-0.5">A Stray Life</p>
              </div>
            </div>

            {/* Heart connector */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-10 h-10 rounded-full bg-primary shadow-lg flex items-center justify-center border-2 border-white">
                <Heart className="w-5 h-5 text-primary-foreground fill-primary-foreground" />
              </div>
            </div>

            {/* AFTER */}
            <div className="flex-1 relative">
              <img
                src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500&h=320&fit=crop&auto=format"
                alt="Happy dog after adoption"
                className="w-full h-52 sm:h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black/10" />
              <div className="absolute top-3 left-3">
                <span className="px-2 py-1 bg-primary/80 text-white rounded-lg text-xs font-semibold uppercase tracking-wide">After</span>
                <p className="text-white/90 text-xs mt-1 ml-0.5">A Life Full of Love</p>
              </div>
            </div>
          </div>

          {/* Story text */}
          <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-lg mx-auto">
            Bella once wandered the streets searching for food and shelter. After being adopted, she found a loving family, regular meals, and a safe home. Today, Bella enjoys a happy life filled with love and care.
          </p>

          {/* CTA */}
          <button
            onClick={() => document.getElementById('pet-grid')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity shadow-md"
          >
            Browse All Pets <ArrowRight className="w-4 h-4" />
          </button>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-8 mt-10 pt-8 border-t border-border">
            {[
              { value: '47+', label: 'Pets Adopted' },
              { value: '8', label: 'Available Now' },
              { value: '98%', label: 'Happy Families' },
            ].map((s, i, arr) => (
              <div key={s.label} className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-foreground font-semibold" style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.4rem' }}>{s.value}</p>
                  <p className="text-muted-foreground text-xs">{s.label}</p>
                </div>
                {i < arr.length - 1 && <div className="w-px h-8 bg-border" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works teaser */}
      <div className="border-b border-border bg-muted/40 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
            <div>
              <h2 className="text-foreground" style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.4rem' }}>How It Works</h2>
              <p className="text-muted-foreground text-sm">Three simple steps to your perfect match</p>
            </div>
            <button
              onClick={() => onNavigate('how-it-works')}
              className="flex items-center gap-1.5 text-primary text-sm font-medium hover:underline shrink-0"
            >
              Full process guide <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { step: '01', icon: <Search className="w-5 h-5" />, title: 'Browse & Self-Screen', desc: 'Filter pets by species, temperament, and lifestyle needs. Every profile gives you enough detail to self-assess before applying.', color: 'bg-primary/10 text-primary' },
              { step: '02', icon: <ClipboardList className="w-5 h-5" />, title: 'Complete Two-Stage Screening', desc: 'Fill out your one-time adopter profile, then answer a short pet-specific questionnaire when you apply. No guesswork, no generic forms.', color: 'bg-accent/10 text-accent' },
              { step: '03', icon: <Home className="w-5 h-5" />, title: 'Meet, Adopt & Get Supported', desc: 'Pass screening, schedule an in-person interview, and bring your pet home. Post-adoption care reminders and chat support stay with you after.', color: 'bg-purple-100 text-purple-700' },
            ].map(item => (
              <div key={item.step} className="bg-card border border-border rounded-2xl p-5 flex gap-4 items-start">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                  {item.icon}
                </div>
                <div>
                  <p className="text-primary/40 font-bold mb-0.5" style={{ fontFamily: "'DM Serif Display', serif", fontSize: '0.85rem' }}>Step {item.step}</p>
                  <h3 className="text-foreground font-semibold mb-1" style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1rem' }}>{item.title}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pet grid */}
      <div id="pet-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-foreground" style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.6rem' }}>
              Available Pets
            </h2>
            <p className="text-muted-foreground text-sm">{filtered.length} pet{filtered.length !== 1 ? 's' : ''} found</p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or breed…"
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring/30 text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-colors ${showFilters ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-foreground border-border hover:bg-muted'}`}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
              {(selectedTemps.length > 0 || vaccinated || neutered || selectedGender !== 'All') && (
                <span className="w-5 h-5 bg-primary-foreground text-primary rounded-full flex items-center justify-center" style={{ fontSize: '0.65rem' }}>
                  {selectedTemps.length + (vaccinated ? 1 : 0) + (neutered ? 1 : 0) + (selectedGender !== 'All' ? 1 : 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Species tabs */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide">
          {SPECIES_OPTIONS.map(s => (
            <button
              key={s}
              onClick={() => setSelectedSpecies(s)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedSpecies === s ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-foreground hover:bg-muted'}`}
            >
              {s === 'All' ? '🐾 All' : s === 'Dog' ? '🐕 Dogs' : s === 'Cat' ? '🐈 Cats' : s === 'Rabbit' ? '🐇 Rabbits' : '🦜 Birds'}
            </button>
          ))}
        </div>

        {/* Extended filters */}
        {showFilters && (
          <div className="mb-6 p-4 bg-card border border-border rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2"><SlidersHorizontal className="w-4 h-4" /> Filter Options</h3>
              <button onClick={() => { setSelectedGender('All'); setVaccinated(false); setNeutered(false); setSelectedTemps([]); }} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Clear all</button>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">Gender</label>
                <div className="flex gap-2">
                  {['All', 'Male', 'Female'].map(g => (
                    <button key={g} onClick={() => setSelectedGender(g)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedGender === g ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-secondary'}`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">Health</label>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={vaccinated} onChange={e => setVaccinated(e.target.checked)} className="accent-primary" />
                    <span className="text-xs text-foreground">Vaccinated only</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={neutered} onChange={e => setNeutered(e.target.checked)} className="accent-primary" />
                    <span className="text-xs text-foreground">Neutered/Spayed only</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">Temperament</label>
                <div className="flex flex-wrap gap-1.5">
                  {TEMPERAMENT_OPTIONS.slice(0, 6).map(t => (
                    <button
                      key={t}
                      onClick={() => toggleTemp(t)}
                      className={`px-2 py-1 rounded-full text-xs transition-colors ${selectedTemps.includes(t) ? 'bg-accent text-accent-foreground' : 'bg-muted text-foreground hover:bg-secondary'}`}
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
            <h3 className="text-foreground font-semibold mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>No pets found</h3>
            <p className="text-muted-foreground text-sm">Try adjusting your filters or search term.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(pet => (
              <PetCard key={pet.id} pet={pet} onView={() => onNavigate('pet-detail', pet)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

