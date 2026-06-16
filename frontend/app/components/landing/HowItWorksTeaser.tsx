import Link from "next/link";
import { Search, ClipboardList, Home, ArrowRight } from 'lucide-react';

interface HowItWorksTeaserProps {
  onNavigate: (page: string) => void;
}

export function HowItWorksTeaser({ onNavigate }: HowItWorksTeaserProps) {
  return (
    <div className="border-b border-[#dabcac] bg-[#F2E8DB]/50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
          <div>
            <h2 className="text-gray-900 font-bold" style={{ fontFamily: "var(--font-dm-serif)", fontSize: '1.4rem' }}>How It Works</h2>
            <p className="text-[#7A6150] text-sm">Three simple steps to your perfect match</p>
          </div>
          <button
            onClick={() => onNavigate('how-it-works')}
            className="flex items-center gap-1.5 text-[#C4622D] text-sm font-medium hover:underline shrink-0"
          >
            Full process guide <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          {[
            { step: '01', icon: <Search className="w-5 h-5" />, title: 'Browse & Self-Screen', desc: 'Filter pets by species, temperament, and lifestyle needs. Every profile gives you enough detail to self-assess before applying.', color: 'bg-[#C4622D]/10 text-[#C4622D]' },
            { step: '02', icon: <ClipboardList className="w-5 h-5" />, title: 'Complete Two-Stage Screening', desc: 'Fill out your one-time adopter profile, then answer a short pet-specific questionnaire when you apply. No guesswork, no generic forms.', color: 'bg-[#E8DDD3] text-[#7A6150]' },
            { step: '03', icon: <Home className="w-5 h-5" />, title: 'Meet, Adopt & Get Supported', desc: 'Pass screening, schedule an in-person interview, and bring your pet home. Post-adoption care reminders and chat support stay with you after.', color: 'bg-purple-100 text-purple-700' },
          ].map(item => (
            <div key={item.step} className="bg-white border border-[#dabcac] rounded-2xl p-5 flex gap-4 items-start">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                {item.icon}
              </div>
              <div>
                <p className="text-[#C4622D]/40 font-bold mb-0.5" style={{ fontFamily: "var(--font-dm-serif)", fontSize: '0.85rem' }}>Step {item.step}</p>
                <h3 className="text-gray-900 font-semibold mb-1" style={{ fontFamily: "var(--font-dm-serif)", fontSize: '1rem' }}>{item.title}</h3>
                <p className="text-[#7A6150] text-xs leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
