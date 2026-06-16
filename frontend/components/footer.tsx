import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Heart, PawPrint, ArrowRight, ExternalLink } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-[#1A1A1A] text-white">
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid lg:grid-cols-2 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#C4622D]/20 flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5 text-[#C4622D]" />
              </div>
              <div>
                <p className="text-xs text-white/50 uppercase tracking-widest">Support Our Mission</p>
                <h2 className="text-white font-semibold" style={{ fontFamily: "var(--font-dm-serif)", fontSize: '1.4rem' }}>
                  Help Us Find More Homes
                </h2>
              </div>
            </div>

            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Every donation directly funds food, veterinary care, vaccinations, and shelter operations for animals waiting for their forever homes. No amount is too small — ₱200 covers a full day of meals for one pet.
            </p>      

            <div className="flex gap-6 mt-8 pt-6 border-t border-white/10">
              {[
                { value: '47+', label: 'Pets rehomed' },
                { value: '₱280K', label: 'Raised this year' },
                { value: '120+', label: 'Donors & counting' },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-white font-semibold" style={{ fontFamily: "var(--font-dm-serif)", fontSize: '1.3rem' }}>{s.value}</p>
                  <p className="text-white/50 text-xs">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#E8DDD3]/20 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-[#E8DDD3]" />
              </div>
              <div>
                <p className="text-xs text-white/50 uppercase tracking-widest">Visit Us</p>
                <h2 className="text-white font-semibold" style={{ fontFamily: "var(--font-dm-serif)", fontSize: '1.4rem' }}>
                  Our Location
                </h2>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden mb-5 border border-white/10" style={{ height: '180px' }}>
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=400&fit=crop&auto=format"
                alt="Map location"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-[#1A1A1A]/80 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#C4622D] flex items-center justify-center shrink-0">
                    <PawPrint className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Paws & Hearts Center</p>
                    <p className="text-white/60 text-xs">Quezon City, Metro Manila</p>
                  </div>
                </div>
              </div>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 border border-white/20 rounded-lg text-white text-xs transition-colors"
              >
                Open in Maps <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="space-y-3">
              {[
                {
                  icon: <MapPin className="w-4 h-4 text-[#E8DDD3] shrink-0" />,
                  label: 'Address',
                  value: '24 Maliksi Street, Brgy. Batasan Hills\nQuezon City, Metro Manila 1126',
                },
                {
                  icon: <Phone className="w-4 h-4 text-[#E8DDD3] shrink-0" />,
                  label: 'Phone',
                  value: '+63 2 8123 4567\n+63 917 888 2345 (Mobile)',
                },
                {
                  icon: <Mail className="w-4 h-4 text-[#E8DDD3] shrink-0" />,
                  label: 'Email',
                  value: 'adopt@pawsandhearts.ph\ndonations@pawsandhearts.ph',
                },
                {
                  icon: <Clock className="w-4 h-4 text-[#E8DDD3] shrink-0" />,
                  label: 'Open Hours',
                  value: 'Mon – Sat: 9:00 AM – 5:00 PM\nSun: 10:00 AM – 3:00 PM',
                },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="mt-0.5">{item.icon}</div>
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-wide mb-0.5">{item.label}</p>
                    {item.value.split('\n').map((line, i) => (
                      <p key={i} className="text-white/80 text-sm">{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#C4622D] flex items-center justify-center">
                <PawPrint className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-semibold" style={{ fontFamily: "var(--font-dm-serif)" }}>Paws & Hearts</span>
            </div>
            <p className="text-white/50 text-xs leading-relaxed mb-4">
              A community adoption platform connecting loving families with animals in need since 2022.
            </p>
          </div>

          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-4">Adopt</p>
            <ul className="space-y-2.5">
              {[
                { label: 'Browse All Pets', page: 'home' },
                { label: 'How It Works', page: 'how-it-works' },
                { label: 'Create Account', page: 'register' },
                { label: 'Sign In', page: 'sign-in' },
              ].map(link => (
                <li key={link.label}>
                  <button onClick={() => onNavigate(link.page)} className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-1.5 group">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-4">Support</p>
            <ul className="space-y-2.5">
              {[
                'Make a Donation',
                'Volunteer With Us',
                'Foster a Pet',
                'Sponsor a Litter',
                'Corporate Partnerships',
              ].map(label => (
                <li key={label}>
                  <button className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-1.5 group">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-4">Stay Updated</p>
            <p className="text-white/60 text-xs mb-3 leading-relaxed">Get new pet alerts and adoption stories straight to your inbox.</p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-3 py-2.5 rounded-xl text-sm bg-white/10 text-white placeholder:text-white/30 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#C4622D]/50"
              />
              <button className="w-full py-2.5 rounded-xl bg-[#C4622D] text-white text-sm font-medium hover:opacity-90 transition-opacity">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-white/30 text-xs">© 2026 Paws & Hearts Adoption Center. All rights reserved.</p>
        <div className="flex gap-5">
          {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(l => (
            <button key={l} className="text-white/30 hover:text-white/60 text-xs transition-colors">{l}</button>
          ))}
        </div>
      </div>
    </footer>
  );
}
