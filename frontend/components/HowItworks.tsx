import { Search, UserPlus, ClipboardList, Shield, MessageSquare, Home, Bell, Clock, Users, CheckCircle2, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onNavigate: (page: string) => void;
}

export function HowItWorks({ onNavigate }: HowItWorksProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-card border-b border-border py-14 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
            Simple & Transparent
          </span>
          <h1 className="text-foreground mb-4" style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(1.9rem, 4vw, 2.75rem)', lineHeight: '1.2' }}>
            How the Adoption Process Works
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed" style={{ fontSize: '1.05rem' }}>
            We've designed every step to be clear, fair, and focused on finding the right match — for both you and the pet. Here's exactly what to expect from first browse to forever home.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">

        {/* 6 Steps */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="flex-1 h-px bg-border" />
            <h2 className="text-foreground font-semibold text-sm uppercase tracking-widest text-muted-foreground">The Adoption Journey</h2>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="space-y-5">
            {[
              {
                step: '01',
                icon: <Search className="w-5 h-5" />,
                title: 'Browse & Self-Screen',
                color: 'bg-primary/10 text-primary border-primary/20',
                accent: 'border-l-primary',
                desc: 'Start by exploring all available pets. Every profile includes the animal\'s name, species, breed, age, gender, vaccination status, neutered status, temperament tags, and any special needs. Use filters to narrow by species, gender, health status, and temperament — so you can self-screen before investing time in an application.',
                details: ['Filter by species, age, gender, temperament', 'See vaccination & neutering status upfront', 'View full pet description and adoption requirements', 'Save favorites with the heart button'],
              },
              {
                step: '02',
                icon: <UserPlus className="w-5 h-5" />,
                title: 'Register & Complete Your Adopter Profile',
                color: 'bg-accent/10 text-accent border-accent/20',
                accent: 'border-l-accent',
                desc: 'After creating your account, you\'ll be guided through a one-time adopter profile. This is the first round of screening and covers details that rarely change — your living situation, experience with pets, and daily schedule. This profile persists across all your applications and powers our smart pet-matching recommendations.',
                details: ['Housing type (apartment, house, farm, etc.)', 'Whether you have a yard or outdoor space', 'Previous pet ownership experience', 'Number of household members & current pets', 'Work schedule (home, part-time, full-time away)'],
              },
              {
                step: '03',
                icon: <ClipboardList className="w-5 h-5" />,
                title: 'Apply & Complete Pet-Specific Screening',
                color: 'bg-purple-100 text-purple-700 border-purple-200',
                accent: 'border-l-purple-500',
                desc: 'When you find a pet you\'d like to adopt, press "Apply for Adoption." You\'ll be given a short custom questionnaire tailored specifically to that animal — based on their history, temperament, and requirements. No two pets have the same questions. This is the second round of screening, and it helps centers make truly informed decisions.',
                details: ['Pet-specific questions crafted by the center', 'Covers lifestyle fit, experience, and readiness', 'Your profile answers auto-fill where applicable', 'Takes under 5 minutes to complete'],
              },
              {
                step: '04',
                icon: <Shield className="w-5 h-5" />,
                title: 'Application Review',
                color: 'bg-blue-100 text-blue-700 border-blue-200',
                accent: 'border-l-blue-500',
                desc: 'The adoption center reviews your full profile alongside your pet-specific answers. You can track your application status in real time from your dashboard — statuses move from Submitted → Screening Passed → Interview Scheduled → Approved. If there\'s a mismatch, you\'ll receive a clear reason and may be redirected to better-suited pets.',
                details: ['Live status tracking from your dashboard', 'Centers review both screening rounds together', 'Transparent status pipeline with notifications', 'Rejection includes feedback when possible'],
              },
              {
                step: '05',
                icon: <MessageSquare className="w-5 h-5" />,
                title: 'Interview & Meet Your Pet',
                color: 'bg-amber-100 text-amber-700 border-amber-200',
                accent: 'border-l-amber-500',
                desc: 'Once your screening passes, the center will schedule an in-person interview and meet-and-greet with the pet. You can coordinate everything through the built-in chat system — ask questions about diet, health history, behavior, or logistics. The interview is relaxed and conversational, not a formal test.',
                details: ['Interview scheduled via the center\'s calendar', 'Built-in chat for all coordination & questions', 'Meet the pet in person before committing', 'Bring a valid ID and proof of residence'],
              },
              {
                step: '06',
                icon: <Home className="w-5 h-5" />,
                title: 'Bring Your Pet Home',
                color: 'bg-rose-100 text-rose-700 border-rose-200',
                accent: 'border-l-rose-500',
                desc: 'After approval, finalize the adoption agreement and pay the adoption fee. The fee covers the pet\'s initial vet health certificate, up-to-date vaccinations, microchipping, and deworming. Then it\'s time — take your new companion home and start your life together.',
                details: ['Adoption fee covers vaccines, microchip & health cert', 'Formal adoption agreement signed digitally', 'Pet\'s medical records handed over to you', 'Post-adoption care dashboard activated immediately'],
              },
            ].map((item, i) => (
              <div key={item.step} className={`bg-card border border-border border-l-4 ${item.accent} rounded-2xl overflow-hidden`}>
                <div className="p-6 sm:p-8">
                  <div className="flex items-start gap-5">
                    <div className="flex flex-col items-center gap-2 shrink-0">
                      <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${item.color}`}>
                        {item.icon}
                      </div>
                      {i < 5 && <div className="w-px flex-1 bg-border min-h-6" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-muted-foreground/50 font-bold" style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.1rem' }}>Step {item.step}</span>
                      </div>
                      <h3 className="text-foreground mb-3" style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.25rem' }}>{item.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">{item.desc}</p>
                      <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
                        {item.details.map((d, j) => (
                          <li key={j} className="flex items-start gap-2 text-xs text-foreground">
                            <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Two-screening callout */}
        <section className="bg-primary/5 border border-primary/15 rounded-2xl p-8">
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-foreground mb-2" style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.3rem' }}>Why Two Rounds of Screening?</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Most adoption platforms use a single generic application. We use two targeted rounds because match quality matters more than speed.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-card border border-border rounded-xl p-4">
                  <p className="text-foreground font-semibold text-sm mb-1">Round 1 — Your Profile</p>
                  <p className="text-muted-foreground text-xs leading-relaxed">Universal across all applications. Covers your lifestyle, home environment, and experience. Saved once, used forever. Powers pet recommendations.</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                  <p className="text-foreground font-semibold text-sm mb-1">Round 2 — Pet-Specific</p>
                  <p className="text-muted-foreground text-xs leading-relaxed">Custom questions written by the center for each individual pet. Addresses that animal's unique history, temperament, and care requirements.</p>
                </div>
              </div>
              <p className="text-muted-foreground text-xs mt-4">Together, these two rounds dramatically reduce post-adoption returns and ensure animals go to truly compatible homes.</p>
            </div>
          </div>
        </section>

        {/* Post-adoption section */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="flex-1 h-px bg-border" />
            <h2 className="text-foreground font-semibold text-sm uppercase tracking-widest text-muted-foreground">After You Adopt</h2>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="grid lg:grid-cols-2 gap-6 items-start">
            <div>
              <h3 className="text-foreground mb-3" style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.5rem' }}>
                We Stay With You After Adoption Day
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Our platform doesn't close when the paperwork is signed. Your post-adoption dashboard keeps you on track with care reminders and lets you stay in touch with the center.
              </p>
              <div className="space-y-4">
                {[
                  { icon: <Bell className="w-4 h-4 text-primary" />, label: 'Smart Care Reminders', desc: 'Automated alerts for vaccine boosters, monthly flea prevention, heartworm medication, and vet visits — delivered to your dashboard on schedule.' },
                  { icon: <Clock className="w-4 h-4 text-accent" />, label: 'Scheduled Vet Prompts', desc: 'Check-in reminders at 1-week, 1-month, and 3-month marks so no health milestone is missed in your pet\'s critical early period.' },
                  { icon: <ClipboardList className="w-4 h-4 text-purple-600" />, label: 'Follow-up Surveys', desc: 'Three short well-being surveys after adoption where you share how your pet is settling in. The center reviews every response.' },
                  { icon: <MessageSquare className="w-4 h-4 text-blue-600" />, label: 'Ongoing Chat Access', desc: 'Have questions about diet, behavior, or health? Your chat line with the center stays open long after the adoption is completed.' },
                  { icon: <Users className="w-4 h-4 text-rose-600" />, label: 'Center Support Team', desc: 'Our team flags follow-up responses that need attention, so help reaches you before small issues become big ones.' },
                ].map((f, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-card border border-border rounded-xl">
                    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">{f.icon}</div>
                    <div>
                      <p className="text-foreground font-semibold text-sm mb-0.5">{f.label}</p>
                      <p className="text-muted-foreground text-xs leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-muted/50 border border-border rounded-2xl p-6">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-5">Post-Adoption Timeline</p>
              <div className="space-y-5">
                {[
                  { time: 'Day 1', label: 'Adoption Confirmed', desc: 'Care dashboard activates. First reminders set. Chat line opens.' },
                  { time: 'Week 1', label: '1-Week Check-in Survey', desc: 'How is your pet adjusting? Any concerns or early observations.' },
                  { time: 'Month 1', label: 'First Vet Visit Reminder + Survey', desc: 'Post-adoption health check prompt and 1-month well-being survey.' },
                  { time: 'Month 3', label: '3-Month Well-being Check', desc: 'Final survey in the series. Vaccination boosters typically due around this time.' },
                  { time: 'Ongoing', label: 'Annual Reminders', desc: 'Yearly vaccine boosters, monthly prevention meds, and open chat access remain available indefinitely.' },
                ].map((t, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-10 h-10 rounded-full bg-card border-2 border-primary/30 flex items-center justify-center">
                        <span className="text-primary font-semibold" style={{ fontSize: '0.6rem', textAlign: 'center', lineHeight: '1.2' }}>{t.time}</span>
                      </div>
                      {i < 4 && <div className="w-px h-5 bg-border mt-1" />}
                    </div>
                    <div className="pb-1">
                      <p className="text-foreground font-semibold text-sm">{t.label}</p>
                      <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="flex-1 h-px bg-border" />
            <h2 className="text-foreground font-semibold text-sm uppercase tracking-widest text-muted-foreground">Common Questions</h2>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { q: 'How long does the process take?', a: 'From application to approval typically takes 5–14 days, depending on the center\'s review queue and interview availability. The average across our platform is 12 days.' },
              { q: 'What does the adoption fee cover?', a: 'The fee covers an initial vet health certificate, up-to-date vaccinations, microchipping, and deworming treatment. The exact services vary per pet — check the pet\'s profile.' },
              { q: 'Can I apply for more than one pet?', a: 'Yes. Your adopter profile is saved once and reused. Each additional application only requires you to complete that pet\'s custom questionnaire.' },
              { q: 'What happens if I\'m rejected?', a: 'You\'ll receive feedback explaining the mismatch. Our system will also suggest other available pets that may be a better fit for your profile and lifestyle.' },
              { q: 'Is the chat system private?', a: 'Yes. Conversations are scoped to specific applications and only visible to you and the adoption center staff managing that pet.' },
              { q: 'What if my pet has a health issue after adoption?', a: 'Keep your chat access open and contact the center. They can advise on care, connect you to vet resources, or help coordinate follow-up support.' },
            ].map((faq, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-5">
                <p className="text-foreground font-semibold text-sm mb-2">{faq.q}</p>
                <p className="text-muted-foreground text-xs leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary rounded-2xl p-8 sm:p-10 text-center">
          <h2 className="text-primary-foreground mb-3" style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.75rem' }}>
            Ready to Find Your Companion?
          </h2>
          <p className="text-primary-foreground/70 mb-6 text-sm leading-relaxed max-w-md mx-auto">
            Browse our available pets and start your adoption journey today. It only takes a few minutes to create your profile and apply.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 px-6 py-3 bg-primary-foreground text-primary rounded-xl font-medium text-sm hover:opacity-90 transition-opacity"
            >
              Browse Available Pets <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('register')}
              className="px-6 py-3 bg-primary-foreground/15 text-primary-foreground border border-primary-foreground/30 rounded-xl font-medium text-sm hover:bg-primary-foreground/25 transition-colors"
            >
              Create Account
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
