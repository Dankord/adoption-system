// import { ArrowLeft, CheckCircle2, XCircle, Heart, Scale, Palette, ClipboardList, Star } from 'lucide-react';
// import type { Pet, User } from './data';

// interface PetDetailProps {
//   pet: Pet;
//   onNavigate: (page: string, data?: unknown) => void;
//   currentUser: User | null;
// }

// const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
//   Available: { bg: 'bg-accent/10 border-accent/20', text: 'text-accent', dot: 'bg-accent' },
//   'Under Review': { bg: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-700', dot: 'bg-yellow-500' },
//   Reserved: { bg: 'bg-orange-50 border-orange-200', text: 'text-orange-700', dot: 'bg-orange-500' },
//   Adopted: { bg: 'bg-gray-100 border-gray-200', text: 'text-gray-500', dot: 'bg-gray-400' },
// };

// export function PetDetail({ pet, onNavigate, currentUser }: PetDetailProps) {
//   const ss = STATUS_STYLES[pet.status] ?? STATUS_STYLES['Available'];

//   const canApply = currentUser?.role === 'customer' && (pet.status === 'Available' || pet.status === 'Under Review');

//   const handleApply = () => {
//     if (!currentUser) {
//       onNavigate('register');
//       return;
//     }
//     if (!currentUser.profileComplete) {
//       onNavigate('profile-setup');
//       return;
//     }
//     onNavigate('apply', pet);
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <button
//           onClick={() => onNavigate('home')}
//           className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 text-sm"
//         >
//           <ArrowLeft className="w-4 h-4" /> Back to Browse
//         </button>

//         <div className="grid lg:grid-cols-5 gap-8">
//           {/* Left: image + quick facts */}
//           <div className="lg:col-span-3 space-y-5">
//             <div className="relative rounded-2xl overflow-hidden shadow-md">
//               <img src={pet.image} alt={pet.name} className="w-full h-72 sm:h-96 object-cover" />
//               <div className={`absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${ss.bg} ${ss.text}`}>
//                 <span className={`w-2 h-2 rounded-full ${ss.dot}`} />
//                 {pet.status}
//               </div>
//               <button className="absolute top-4 right-4 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm">
//                 <Heart className="w-5 h-5 text-muted-foreground" />
//               </button>
//             </div>

//             <div className="bg-card border border-border rounded-2xl p-5">
//               <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
//                 <ClipboardList className="w-4 h-4 text-primary" /> Adoption Requirements
//               </h3>
//               <ul className="space-y-2">
//                 {pet.requirements.map((req, i) => (
//                   <li key={i} className="flex items-start gap-2 text-sm text-foreground">
//                     <Star className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
//                     {req}
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {pet.customQuestions.length > 0 && (
//               <div className="bg-primary/5 border border-primary/15 rounded-2xl p-5">
//                 <h3 className="text-sm font-semibold text-foreground mb-3">
//                   📋 Screening Questions Preview
//                 </h3>
//                 <p className="text-xs text-muted-foreground mb-3">You'll answer these when you apply for {pet.name}:</p>
//                 <ul className="space-y-2">
//                   {pet.customQuestions.map((q, i) => (
//                     <li key={i} className="text-sm text-foreground flex items-start gap-2">
//                       <span className="text-primary font-medium shrink-0">{i + 1}.</span>
//                       {q}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>

//           {/* Right: details + apply */}
//           <div className="lg:col-span-2 space-y-5">
//             <div className="bg-card border border-border rounded-2xl p-6">
//               <div className="mb-4">
//                 <h1 className="text-foreground" style={{ fontFamily: "'DM Serif Display', serif", fontSize: '2rem' }}>
//                   {pet.name}
//                 </h1>
//                 <p className="text-muted-foreground text-sm">{pet.breed} · {pet.species}</p>
//                 {pet.specialNeeds && (
//                   <span className="inline-block mt-2 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-medium">
//                     ★ Special Needs Pet
//                   </span>
//                 )}
//               </div>

//               <div className="grid grid-cols-2 gap-3 mb-5">
//                 {[
//                   { label: 'Age', value: pet.age },
//                   { label: 'Gender', value: pet.gender },
//                   { label: 'Color', value: pet.color },
//                   { label: 'Weight', value: pet.weight },
//                 ].map(f => (
//                   <div key={f.label} className="bg-muted rounded-xl p-3">
//                     <p className="text-xs text-muted-foreground mb-0.5">{f.label}</p>
//                     <p className="text-sm font-medium text-foreground">{f.value}</p>
//                   </div>
//                 ))}
//               </div>

//               <div className="flex flex-col gap-2 mb-5">
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-foreground flex items-center gap-1.5">
//                     {pet.vaccinated ? <CheckCircle2 className="w-4 h-4 text-accent" /> : <XCircle className="w-4 h-4 text-muted-foreground" />}
//                     Vaccinated
//                   </span>
//                   <span className={`text-xs font-medium ${pet.vaccinated ? 'text-accent' : 'text-muted-foreground'}`}>
//                     {pet.vaccinated ? 'Yes' : 'No'}
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-foreground flex items-center gap-1.5">
//                     {pet.neutered ? <CheckCircle2 className="w-4 h-4 text-accent" /> : <XCircle className="w-4 h-4 text-muted-foreground" />}
//                     Neutered / Spayed
//                   </span>
//                   <span className={`text-xs font-medium ${pet.neutered ? 'text-accent' : 'text-muted-foreground'}`}>
//                     {pet.neutered ? 'Yes' : 'No'}
//                   </span>
//                 </div>
//               </div>

//               <div className="mb-5">
//                 <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Temperament</h3>
//                 <div className="flex flex-wrap gap-2">
//                   {pet.temperament.map(t => (
//                     <span key={t} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-medium">
//                       {t}
//                     </span>
//                   ))}
//                 </div>
//               </div>

//               <div className="border-t border-border pt-4 mb-5">
//                 <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">About {pet.name}</h3>
//                 <p className="text-sm text-foreground leading-relaxed">{pet.description}</p>
//               </div>

//               <div className="border-t border-border pt-4">
//                 <div className="flex items-center justify-between mb-4">
//                   <span className="text-sm text-muted-foreground">Adoption Fee</span>
//                   <span className="text-primary font-semibold" style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.25rem' }}>
//                     ₱{pet.adoptionFee.toLocaleString()}
//                   </span>
//                 </div>

//                 {pet.status === 'Adopted' ? (
//                   <div className="w-full text-center py-3 rounded-xl bg-muted text-muted-foreground text-sm font-medium">
//                     This pet has been adopted
//                   </div>
//                 ) : pet.status === 'Reserved' ? (
//                   <div className="w-full text-center py-3 rounded-xl bg-orange-50 text-orange-700 border border-orange-200 text-sm font-medium">
//                     Currently Reserved
//                   </div>
//                 ) : !currentUser ? (
//                   <div className="space-y-2">
//                     <button
//                       onClick={() => onNavigate('register')}
//                       className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
//                     >
//                       Register to Apply
//                     </button>
//                     <button
//                       onClick={() => onNavigate('login')}
//                       className="w-full py-3 rounded-xl bg-secondary text-secondary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
//                     >
//                       Sign in
//                     </button>
//                   </div>
//                 ) : currentUser.role !== 'customer' ? (
//                   <div className="w-full text-center py-3 rounded-xl bg-muted text-muted-foreground text-sm">
//                     Owner accounts cannot adopt
//                   </div>
//                 ) : !currentUser.profileComplete ? (
//                   <div className="space-y-3">
//                     <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
//                       Complete your adopter profile first to unlock applications.
//                     </div>
//                     <button
//                       onClick={() => onNavigate('profile-setup')}
//                       className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
//                     >
//                       Complete Profile →
//                     </button>
//                   </div>
//                 ) : (
//                   <button
//                     onClick={handleApply}
//                     disabled={!canApply}
//                     className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     Apply for Adoption
//                   </button>
//                 )}
//               </div>
//             </div>

//             <div className="bg-card border border-border rounded-2xl p-5">
//               <div className="flex items-center gap-3 mb-3">
//                 <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
//                   <Scale className="w-5 h-5 text-primary" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-foreground">Adoption Fee Covers</p>
//                   <p className="text-xs text-muted-foreground">What's included</p>
//                 </div>
//               </div>
//               <ul className="space-y-1.5">
//                 {['Initial vet health certificate', 'Up-to-date vaccinations', 'Microchipping', 'Deworming treatment', 'Post-adoption follow-up support'].map(item => (
//                   <li key={item} className="flex items-center gap-2 text-xs text-foreground">
//                     <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
//                     {item}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
