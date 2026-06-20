import Link from "next/link";
import { Heart, ArrowRight } from 'lucide-react';

interface HeroProps {
  totalAdopted?: number;
  availableNow?: number;
}

export function Hero({ totalAdopted, availableNow }: HeroProps) {
  const adoptedDisplay = totalAdopted !== undefined ? `${totalAdopted}+` : '47+';
  const availableDisplay = availableNow !== undefined ? `${availableNow}` : '8';

  return (
    <div className="relative overflow-hidden bg-[#FFFAF4] border-b border-[#dabcac]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 text-center">

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C4622D]/10 text-[#C4622D] text-xs font-medium mb-6">
          🐾 Community Adoption Platform
        </span>

        <h1 className="text-[#C4622D] mb-3" style={{ fontFamily: "var(--font-dm-serif)", fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: '1.2', fontStyle: 'italic' }}>
          Every pet deserves a loving home
        </h1>

        <p className="text-[#7A6150] font-medium mb-8 flex items-center justify-center gap-2 text-sm">
          <span className="text-[#C4622D]">✦</span>
          A Life Changed Through Adoption
          <span className="text-[#C4622D]">✦</span>
        </p>

        <div className="relative flex items-stretch gap-0 rounded-2xl overflow-hidden shadow-lg border border-[#dabcac] mb-8 mx-auto max-w-2xl">
          <div className="flex-1 relative">
            <img
              src="https://images.unsplash.com/photo-1592508789696-d576871f7584?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGhvbWVsZXNzJTIwZG9nfGVufDB8fDB8fHww"
              alt="Stray dog before adoption"
              className="w-full h-52 sm:h-64 object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute top-3 left-3">
              <span className="px-2 py-1 bg-black/60 text-white rounded-lg text-xs font-semibold uppercase tracking-wide">Before</span>
              <p className="text-white/80 text-xs mt-1 ml-0.5">A Stray Life</p>
            </div>
          </div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="w-10 h-10 rounded-full bg-[#C4622D] shadow-lg flex items-center justify-center border-2 border-white">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
          </div>

          <div className="flex-1 relative">
            <img
              src="https://paradepets.com/.image/NTowMDAwMDAwMDAwMjE3MjU5/happy-pit-bull.jpg?profile=share4-3"
              alt="Happy dog after adoption"
              className="w-full h-52 sm:h-64 object-cover"
            />
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute top-3 left-3">
              <span className="px-2 py-1 bg-[#C4622D]/80 text-white rounded-lg text-xs font-semibold uppercase tracking-wide">After</span>
              <p className="text-white/90 text-xs mt-1 ml-0.5">A Life Full of Love</p>
            </div>
          </div>
        </div>

        <p className="text-[#7A6150] text-sm leading-relaxed mb-8 max-w-lg mx-auto">
          Bella once wandered the streets searching for food and shelter. After being adopted, she found a loving family, regular meals, and a safe home. Today, Bella enjoys a happy life filled with love and care.
        </p>

        <Link
          href="#pet-grid"
          className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#C4622D] text-white rounded-full font-medium hover:opacity-90 transition-opacity shadow-md"
        >
          Browse All Pets <ArrowRight className="w-4 h-4" />
        </Link>

        <div className="flex items-center justify-center gap-8 mt-10 pt-8 border-t border-[#dabcac]">
          {[
            { value: adoptedDisplay, label: 'Pets Adopted' },
            { value: availableDisplay, label: 'Available Now' },
            { value: '98%', label: 'Happy Families' },
          ].map((s, i, arr) => (
            <div key={s.label} className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-gray-900 font-semibold" style={{ fontFamily: "var(--font-dm-serif)", fontSize: '1.4rem' }}>{s.value}</p>
                <p className="text-[#7A6150] text-xs">{s.label}</p>
              </div>
              {i < arr.length - 1 && <div className="w-px h-8 bg-[#dabcac]" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
