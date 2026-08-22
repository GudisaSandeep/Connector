'use client';

import React, { useState } from 'react';
import { HackathonSquad, TechProfile, MatchResult } from '@/types';
import { SAMPLE_SQUADS, CURRENT_USER } from '@/lib/mockData';
import { 
  Users, 
  Plus, 
  Calendar, 
  Trophy, 
  Sparkles, 
  Code2, 
  CheckCircle2, 
  UserPlus, 
  Trash2,
  Layers,
  ArrowRight,
  Flame
} from 'lucide-react';

interface SquadsViewProps {
  matches: MatchResult[];
  onOpenChatWith: (profile: TechProfile) => void;
}

export function SquadsView({ matches, onOpenChatWith }: SquadsViewProps) {
  const [squads, setSquads] = useState<HackathonSquad[]>(SAMPLE_SQUADS);
  const [isNewSquadModalOpen, setIsNewSquadModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedSquadId, setSelectedSquadId] = useState<string | null>(null);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);

  // New squad form
  const [newSquadName, setNewSquadName] = useState('');
  const [newHackathonName, setNewHackathonName] = useState('');
  const [newTargetDate, setNewTargetDate] = useState('Nov 10-12, 2026');
  const [newDescription, setNewDescription] = useState('');

  const openAssignModal = (squadId: string, slotIndex: number) => {
    setSelectedSquadId(squadId);
    setSelectedSlotIndex(slotIndex);
    setIsAssignModalOpen(true);
  };

  const assignMemberToSlot = (member: TechProfile) => {
    if (!selectedSquadId || selectedSlotIndex === null) return;

    setSquads(prev => prev.map(sq => {
      if (sq.id === selectedSquadId) {
        const updatedSlots = [...sq.slots];
        updatedSlots[selectedSlotIndex] = {
          ...updatedSlots[selectedSlotIndex],
          assignedMember: member
        };
        return { ...sq, slots: updatedSlots };
      }
      return sq;
    }));

    setIsAssignModalOpen(false);
  };

  const removeMemberFromSlot = (squadId: string, slotIndex: number) => {
    setSquads(prev => prev.map(sq => {
      if (sq.id === squadId) {
        const updatedSlots = [...sq.slots];
        updatedSlots[slotIndex] = {
          ...updatedSlots[slotIndex],
          assignedMember: undefined
        };
        return { ...sq, slots: updatedSlots };
      }
      return sq;
    }));
  };

  const handleCreateSquad = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSquadName || !newHackathonName) return;

    const newSquad: HackathonSquad = {
      id: `squad-${Date.now()}`,
      name: newSquadName,
      hackathonName: newHackathonName,
      targetDate: newTargetDate,
      description: newDescription || 'Building an innovative tech product to compete for top prizes.',
      slots: [
        {
          role: 'Team Lead / Full-Stack',
          requiredSkills: ['Next.js', 'React', 'TypeScript'],
          assignedMember: CURRENT_USER
        },
        {
          role: 'AI / Backend Engineer',
          requiredSkills: ['Python', 'FastAPI', 'PyTorch'],
          assignedMember: undefined
        },
        {
          role: 'UI/UX & Frontend Designer',
          requiredSkills: ['TailwindCSS', 'Figma', 'React'],
          assignedMember: undefined
        },
        {
          role: 'Pitch & Systems Specialist',
          requiredSkills: ['Cloud Architecture', 'Presentation'],
          assignedMember: undefined
        }
      ]
    };

    setSquads([newSquad, ...squads]);
    setIsNewSquadModalOpen(false);
    setNewSquadName('');
    setNewHackathonName('');
    setNewDescription('');
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-semibold mb-2">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            Hackathon & Co-Founder Squads
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Assemble Your Dream Team</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Fill crucial complementary roles (AI, Frontend, Backend, Design) from your matched developers to win upcoming hackathons and launch startups.
          </p>
        </div>

        <button
          onClick={() => setIsNewSquadModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all active:scale-95 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create New Squad
        </button>
      </div>

      {/* Squads List */}
      <div className="space-y-6">
        {squads.map((squad) => {
          const filledSlots = squad.slots.filter(s => !!s.assignedMember).length;
          const totalSlots = squad.slots.length;
          const isComplete = filledSlots === totalSlots;

          return (
            <div key={squad.id} className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-white tracking-tight">{squad.name}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold font-mono ${
                      isComplete 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {filledSlots}/{totalSlots} Slots Filled
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1 text-indigo-300">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      {squad.hackathonName}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {squad.targetDate}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 max-w-md sm:text-right">
                  {squad.description}
                </p>
              </div>

              {/* Squad Slots Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {squad.slots.map((slot, idx) => (
                  <div 
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between min-h-[170px] ${
                      slot.assignedMember 
                        ? 'bg-slate-950/70 border-indigo-500/40 shadow-md' 
                        : 'bg-slate-950/30 border-dashed border-slate-800 hover:border-indigo-500/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-semibold text-slate-400 font-mono">
                          Slot #{idx + 1}
                        </span>
                        {slot.assignedMember && slot.assignedMember.id !== CURRENT_USER.id && (
                          <button
                            onClick={() => removeMemberFromSlot(squad.id, idx)}
                            className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                            title="Remove member"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <h4 className="text-xs font-bold text-white mb-2">{slot.role}</h4>

                      {slot.assignedMember ? (
                        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                          <img 
                            src={slot.assignedMember.avatar} 
                            alt={slot.assignedMember.name} 
                            className="w-9 h-9 rounded-lg object-cover border border-slate-700"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-xs text-slate-100 truncate">
                              {slot.assignedMember.name} {slot.assignedMember.id === CURRENT_USER.id && '(You)'}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono truncate">
                              {slot.assignedMember.handle}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <div className="text-[11px] text-slate-500 font-medium">Desired Skills:</div>
                          <div className="flex flex-wrap gap-1">
                            {slot.requiredSkills.map((sk, sIdx) => (
                              <span key={sIdx} className="px-1.5 py-0.5 rounded bg-slate-900 text-[10px] font-mono text-indigo-300 border border-slate-800">
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-900">
                      {slot.assignedMember ? (
                        slot.assignedMember.id !== CURRENT_USER.id ? (
                          <button
                            onClick={() => onOpenChatWith(slot.assignedMember!)}
                            className="w-full py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-200 text-[11px] font-semibold transition-colors flex items-center justify-center gap-1"
                          >
                            <span>Chat in Room</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : (
                          <div className="text-[11px] text-center font-mono text-slate-500 py-1">
                            Squad Captain 👑
                          </div>
                        )
                      ) : (
                        <button
                          onClick={() => openAssignModal(squad.id, idx)}
                          className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white text-[11px] font-semibold transition-all flex items-center justify-center gap-1.5"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          Assign Match
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Assign Member Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-indigo-400" />
              Assign Matched Dev to Squad Slot
            </h3>
            <p className="text-xs text-slate-400">
              Select one of your matched developers to fill this slot:
            </p>

            <div className="max-h-64 overflow-y-auto space-y-2 custom-scrollbar">
              {matches.map((m) => (
                <div
                  key={m.id}
                  onClick={() => assignMemberToSlot(m.userProfile)}
                  className="p-3 rounded-2xl bg-slate-950/60 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={m.userProfile.avatar} 
                      alt={m.userProfile.name} 
                      className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-white group-hover:text-indigo-300">{m.userProfile.name}</h4>
                      <p className="text-[11px] text-slate-400">{m.userProfile.primaryRole} • {m.userProfile.university.split(' ')[0]}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-amber-400">
                    <Flame className="w-3.5 h-3.5 fill-amber-400" />
                    {m.synergyScore}%
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsAssignModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Create New Squad Modal */}
      {isNewSquadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              Create Hackathon Squad
            </h3>

            <form onSubmit={handleCreateSquad} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 mb-1 block">Squad Name</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. AgenticStack Prime"
                  value={newSquadName}
                  onChange={(e) => setNewSquadName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 mb-1 block">Hackathon / Goal</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. TreeHacks 2026 / YC Application"
                  value={newHackathonName}
                  onChange={(e) => setNewHackathonName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 mb-1 block">Target Date</label>
                <input 
                  type="text"
                  placeholder="e.g. Nov 14-16, 2026"
                  value={newTargetDate}
                  onChange={(e) => setNewTargetDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 mb-1 block">Mission & Vision</label>
                <textarea 
                  rows={3}
                  placeholder="What is your squad aiming to build and win with?"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewSquadModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30"
                >
                  Create Squad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
