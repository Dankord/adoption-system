"use client";

import { useAuth } from "@/lib/auth-context";
import { SiteHeader } from "@/components/site-header";
import { ROUTES } from "@/lib/routes";
import Link from "next/link";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  
  return (

import { useState } from 'react';
import { PlusCircle, Edit3, Trash2, Eye, MessageCircle, BarChart3, Users, CheckCircle, XCircle, Calendar, Send, ChevronDown, PawPrint } from 'lucide-react';
import type { Application, Message, User } from './data';
import { PETS, STATS, type Pet } from './data';

interface OwnerDashboardProps {
  applications: Application[];
  messages: Message[];
  onUpdateApplicationStatus: (id: number, status: Application['status'], interviewDate?: string) => void;
  onSendMessage: (text: string, applicationId: number) => void;
  currentUser: User;
}

const STATUS_COLORS: Record<string, string> = {
  Submitted: 'bg-blue-50 text-blue-700 border-blue-200',
  'Screening Passed': 'bg-green-50 text-green-700 border-green-200',
  'Interview Scheduled': 'bg-purple-50 text-purple-700 border-purple-200',
  Approved: 'bg-accent/10 text-accent border-accent/20',
  Rejected: 'bg-red-50 text-red-700 border-red-200',
  Completed: 'bg-gray-100 text-gray-700 border-gray-200',
};

const PET_STATUS_COLORS: Record<string, string> = {
  Available: 'bg-accent/10 text-accent',
  'Under Review': 'bg-yellow-100 text-yellow-700',
  Reserved: 'bg-orange-100 text-orange-700',
  Adopted: 'bg-gray-100 text-gray-500',
};

function AddPetModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: '', species: 'Dog', breed: '', age: '', gender: 'Male', adoptionFee: '' });
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg shadow-xl">
        <h2 className="text-foreground font-semibold mb-5" style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.3rem' }}>Add New Pet</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-5">
          {[
            { label: 'Pet Name', key: 'name', placeholder: 'e.g., Coco' },
            { label: 'Breed', key: 'breed', placeholder: 'e.g., Labrador' },
            { label: 'Age', key: 'age', placeholder: 'e.g., 2 years' },
            { label: 'Adoption Fee (₱)', key: 'adoptionFee', placeholder: 'e.g., 2500' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-medium text-muted-foreground mb-1">{f.label}</label>
              <input
                value={(form as Record<string, string>)[f.key]}
                onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Species</label>
            <select value={form.species} onChange={e => setForm(prev => ({ ...prev, species: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30">
              {['Dog', 'Cat', 'Rabbit', 'Bird', 'Other'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Gender</label>
            <select value={form.gender} onChange={e => setForm(prev => ({ ...prev, gender: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30">
              {['Male', 'Female'].map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors">Cancel</button>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">Add Pet</button>
        </div>
      </div>
    </div>
  );
}

export function OwnerDashboard({ applications, messages, onUpdateApplicationStatus, onSendMessage, currentUser }: OwnerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'pets' | 'applications' | 'stats' | 'chat'>('pets');
  const [showAddPet, setShowAddPet] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(applications[0] ?? null);
  const [newMessage, setNewMessage] = useState('');
  const [expandedApp, setExpandedApp] = useState<number | null>(null);
  const [interviewDate, setInterviewDate] = useState('');

  const chatMessages = messages.filter(m => m.applicationId === selectedApp?.id);

  const tabs = [
    { id: 'pets' as const, label: 'Pet Listings', icon: <PawPrint className="w-4 h-4" /> },
    { id: 'applications' as const, label: 'Applicants', icon: <Users className="w-4 h-4" />, count: applications.filter(a => a.status === 'Submitted').length },
    { id: 'stats' as const, label: 'Statistics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'chat' as const, label: 'Messages', icon: <MessageCircle className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      {showAddPet && <AddPetModal onClose={() => setShowAddPet(false)} />}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-foreground" style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.75rem' }}>
              Center Dashboard
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Paws & Hearts Adoption Center · Owner Portal</p>
          </div>
          <button
            onClick={() => setShowAddPet(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <PlusCircle className="w-4 h-4" /> Add Pet
          </button>
        </div>

        {/* Stats overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Available', value: STATS.available, sub: 'of ' + STATS.totalPets + ' listed', color: 'text-accent' },
            { label: 'Pending Review', value: STATS.pendingApplications, sub: 'applications', color: 'text-blue-600' },
            { label: 'Adopted This Month', value: STATS.adoptedThisMonth, sub: 'this June', color: 'text-primary' },
            { label: 'All-Time Adoptions', value: STATS.totalAdoptions, sub: 'since founding', color: 'text-foreground' },
          ].map(s => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-4">
              <p className={`font-semibold ${s.color}`} style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.75rem' }}>{s.value}</p>
              <p className="text-foreground text-xs font-medium">{s.label}</p>
              <p className="text-muted-foreground text-xs">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted rounded-xl p-1 mb-6 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {tab.icon}
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Pets tab */}
        {activeTab === 'pets' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {PETS.map(pet => (
              <div key={pet.id} className="bg-card border border-border rounded-2xl overflow-hidden group">
                <div className="relative">
                  <img src={pet.image} alt={pet.name} className="w-full h-40 object-cover" />
                  <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-medium ${PET_STATUS_COLORS[pet.status]}`}>
                    {pet.status}
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-foreground font-semibold" style={{ fontFamily: "'DM Serif Display', serif" }}>{pet.name}</h3>
                    <span className="text-primary text-xs font-medium">₱{pet.adoptionFee.toLocaleString()}</span>
                  </div>
                  <p className="text-muted-foreground text-xs mb-3">{pet.breed} · {pet.age} · {pet.gender}</p>
                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-muted text-foreground text-xs hover:bg-secondary transition-colors">
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-destructive hover:bg-red-50 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Applications tab */}
        {activeTab === 'applications' && (
          <div className="space-y-4">
            {applications.length === 0 ? (
              <div className="text-center py-20 bg-card border border-border rounded-2xl">
                <p className="text-muted-foreground">No applications yet.</p>
              </div>
            ) : (
              applications.map(app => (
                <div key={app.id} className="bg-card border border-border rounded-2xl overflow-hidden">
                  <div
                    className="p-5 flex items-start gap-4 cursor-pointer"
                    onClick={() => setExpandedApp(expandedApp === app.id ? null : app.id)}
                  >
                    <img src={app.petImage} alt={app.petName} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <p className="text-foreground font-semibold">{app.applicantName}</p>
                          <p className="text-muted-foreground text-xs">Applied for <span className="font-medium text-foreground">{app.petName}</span> · {app.submittedAt}</p>
                          <p className="text-muted-foreground text-xs">{app.applicantEmail}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full border text-xs font-medium ${STATUS_COLORS[app.status]}`}>
                            {app.status}
                          </span>
                          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${expandedApp === app.id ? 'rotate-180' : ''}`} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {expandedApp === app.id && (
                    <div className="border-t border-border px-5 pb-5 pt-4 space-y-4">
                      {/* Answers */}
                      {Object.keys(app.answers).length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Screening Answers</p>
                          <div className="space-y-3">
                            {Object.entries(app.answers).map(([q, a]) => (
                              <div key={q} className="p-3 bg-muted rounded-xl">
                                <p className="text-xs text-muted-foreground mb-1">{q}</p>
                                <p className="text-sm text-foreground">{a}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Interview scheduling */}
                      {(app.status === 'Screening Passed' || app.status === 'Interview Scheduled') && (
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Interview Date</p>
                          <div className="flex gap-3 items-center">
                            <input
                              type="date"
                              defaultValue={app.interviewDate ?? ''}
                              onChange={e => setInterviewDate(e.target.value)}
                              className="px-3 py-2 rounded-xl bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
                            />
                            <button
                              onClick={() => onUpdateApplicationStatus(app.id, 'Interview Scheduled', interviewDate)}
                              className="flex items-center gap-1.5 px-3 py-2 bg-purple-600 text-white rounded-xl text-xs font-medium hover:opacity-90 transition-opacity"
                            >
                              <Calendar className="w-3.5 h-3.5" /> Schedule
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Update Status</p>
                        <div className="flex flex-wrap gap-2">
                          {app.status === 'Submitted' && (
                            <button
                              onClick={() => onUpdateApplicationStatus(app.id, 'Screening Passed')}
                              className="flex items-center gap-1.5 px-4 py-2 bg-accent text-accent-foreground rounded-xl text-xs font-medium hover:opacity-90 transition-opacity"
                            >
                              <CheckCircle className="w-3.5 h-3.5" /> Pass Screening
                            </button>
                          )}
                          {app.status === 'Interview Scheduled' && (
                            <button
                              onClick={() => onUpdateApplicationStatus(app.id, 'Approved')}
                              className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-xl text-xs font-medium hover:opacity-90 transition-opacity"
                            >
                              <CheckCircle className="w-3.5 h-3.5" /> Approve
                            </button>
                          )}
                          {app.status === 'Approved' && (
                            <button
                              onClick={() => onUpdateApplicationStatus(app.id, 'Completed')}
                              className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-medium hover:opacity-90 transition-opacity"
                            >
                              <CheckCircle className="w-3.5 h-3.5" /> Mark Completed
                            </button>
                          )}
                          {app.status !== 'Rejected' && app.status !== 'Completed' && (
                            <button
                              onClick={() => onUpdateApplicationStatus(app.id, 'Rejected')}
                              className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-medium hover:opacity-90 transition-opacity"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Reject
                            </button>
                          )}
                          <button
                            onClick={() => { setSelectedApp(app); setActiveTab('chat'); }}
                            className="flex items-center gap-1.5 px-4 py-2 bg-muted text-foreground rounded-xl text-xs font-medium hover:bg-secondary transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5" /> Message Applicant
                          </button>
                          <button className="flex items-center gap-1.5 px-4 py-2 bg-muted text-foreground rounded-xl text-xs font-medium hover:bg-secondary transition-colors">
                            <Eye className="w-3.5 h-3.5" /> View Full Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Stats tab */}
        {activeTab === 'stats' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-foreground font-semibold mb-5" style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.1rem' }}>Pet Status Breakdown</h3>
              <div className="space-y-4">
                {[
                  { label: 'Available', value: STATS.available, total: STATS.totalPets, color: 'bg-accent' },
                  { label: 'Under Review', value: STATS.underReview, total: STATS.totalPets, color: 'bg-yellow-500' },
                  { label: 'Reserved', value: STATS.reserved, total: STATS.totalPets, color: 'bg-orange-500' },
                  { label: 'Adopted (all time)', value: STATS.totalAdoptions, total: STATS.totalAdoptions + STATS.totalPets, color: 'bg-primary' },
                ].map(s => (
                  <div key={s.label}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-foreground font-medium">{s.label}</span>
                      <span className="text-muted-foreground">{s.value}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${s.color} transition-all`} style={{ width: `${Math.round((s.value / s.total) * 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-foreground font-semibold mb-5" style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.1rem' }}>Applications by Status</h3>
              <div className="space-y-3">
                {(['Submitted', 'Screening Passed', 'Interview Scheduled', 'Approved', 'Rejected', 'Completed'] as Application['status'][]).map(status => {
                  const count = applications.filter(a => a.status === status).length;
                  return (
                    <div key={status} className="flex items-center justify-between p-3 bg-muted rounded-xl">
                      <span className="text-sm text-foreground">{status}</span>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[status]}`}>{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-foreground font-semibold mb-5" style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.1rem' }}>Key Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Avg. Processing Days', value: STATS.avgProcessingDays + 'd', sub: 'Submit to Approve' },
                  { label: 'This Month Adoptions', value: STATS.adoptedThisMonth, sub: 'June 2026' },
                  { label: 'Total Listed', value: STATS.totalPets, sub: 'All species' },
                  { label: 'Pending Applications', value: STATS.pendingApplications, sub: 'Need review' },
                ].map(m => (
                  <div key={m.label} className="p-4 bg-muted rounded-xl">
                    <p className="text-primary font-semibold mb-0.5" style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.5rem' }}>{m.value}</p>
                    <p className="text-foreground text-xs font-medium">{m.label}</p>
                    <p className="text-muted-foreground text-xs">{m.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-foreground font-semibold mb-5" style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.1rem' }}>Species Distribution</h3>
              <div className="space-y-3">
                {[
                  { species: 'Dogs 🐕', count: 4 },
                  { species: 'Cats 🐈', count: 2 },
                  { species: 'Rabbits 🐇', count: 1 },
                  { species: 'Birds 🦜', count: 1 },
                ].map(s => (
                  <div key={s.species}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-foreground">{s.species}</span>
                      <span className="text-muted-foreground font-medium">{s.count}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${(s.count / 8) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Chat tab */}
        {activeTab === 'chat' && (
          <div className="grid lg:grid-cols-3 gap-5 h-[600px]">
            <div className="lg:col-span-1 bg-card border border-border rounded-2xl overflow-hidden flex flex-col">
              <div className="p-4 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">Conversations</h3>
              </div>
              <div className="flex-1 overflow-y-auto">
                {applications.map(app => (
                  <button
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className={`w-full text-left p-4 flex items-center gap-3 border-b border-border last:border-0 hover:bg-muted transition-colors ${selectedApp?.id === app.id ? 'bg-primary/5' : ''}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold shrink-0" style={{ fontSize: '0.75rem' }}>
                      {app.applicantName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{app.applicantName}</p>
                      <p className="text-xs text-muted-foreground truncate">Re: {app.petName}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[app.status]}`}>{app.status.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 bg-card border border-border rounded-2xl flex flex-col overflow-hidden">
              {selectedApp ? (
                <>
                  <div className="p-4 border-b border-border flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold shrink-0" style={{ fontSize: '0.75rem' }}>
                      {selectedApp.applicantName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{selectedApp.applicantName}</p>
                      <p className="text-xs text-muted-foreground">Re: {selectedApp.petName} · {selectedApp.applicantEmail}</p>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {chatMessages.map(msg => (
                      <div key={msg.id} className={`flex ${msg.senderRole === 'owner' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-sm px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.senderRole === 'owner' ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-muted text-foreground rounded-bl-sm'}`}>
                          {msg.text}
                          <p className={`text-xs mt-1 ${msg.senderRole === 'owner' ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                    {chatMessages.length === 0 && (
                      <div className="text-center text-sm text-muted-foreground py-8">No messages yet.</div>
                    )}
                  </div>
                  <div className="p-4 border-t border-border flex gap-3">
                    <input
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && newMessage.trim()) { onSendMessage(newMessage, selectedApp.id); setNewMessage(''); } }}
                      placeholder="Reply to applicant…"
                      className="flex-1 px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
                    />
                    <button
                      onClick={() => { if (newMessage.trim()) { onSendMessage(newMessage, selectedApp.id); setNewMessage(''); } }}
                      className="p-2.5 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                  Select a conversation
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
