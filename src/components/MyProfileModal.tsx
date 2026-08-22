'use client';

import React, { useState } from 'react';
import { TechProfile, IntentType } from '@/types';
import { TechCard } from './TechCard';
import { 
  X, 
  User, 
  Edit3, 
  Check, 
  Sparkles, 
  Code2, 
  GraduationCap, 
  MapPin,
  Flame
} from 'lucide-react';

interface MyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: TechProfile;
  onUpdateProfile: (updated: TechProfile) => void;
}

export function MyProfileModal({
  isOpen,
  onClose,
  currentUser,
  onUpdateProfile
}: MyProfileModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tagline, setTagline] = useState(currentUser.tagline);
  const [bio, setBio] = useState(currentUser.bio);
  const [selectedIntents, setSelectedIntents] = useState<IntentType[]>(currentUser.intents);
  const [primaryRole, setPrimaryRole] = useState(currentUser.primaryRole);

  if (!isOpen) return null;

  const availableIntents: IntentType[] = [
    'Hackathon Teammate',
    'Startup Co-Founder',
    'LeetCode / DSA Partner',
    'Open-Source Collaborator',
    'Project Peer Review'
  ];

  const handleSave = () => {
    onUpdateProfile({
      ...currentUser,
      tagline,
      bio,
      intents: selectedIntents,
      primaryRole: primaryRole as any
    });
    setIsEditing(false);
  };

  const toggleIntent = (intent: IntentType) => {
    setSelectedIntents(prev => 
      prev.includes(intent) ? prev.filter(i => i !== intent) : [...prev, intent]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto custom-scrollbar text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Your Developer Profile</h3>
              <p className="text-xs text-slate-400">How other students see you in the swipe deck</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Preview Card' : 'Edit Details'}</span>
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 mb-1.5 block">Primary Discipline</label>
              <select
                value={primaryRole}
                onChange={(e) => setPrimaryRole(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
              >
                <option value="Full-Stack">Full-Stack</option>
                <option value="AI / ML Engineer">AI / ML Engineer</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Systems / DevOps">Systems / DevOps</option>
                <option value="UI/UX & Product">UI/UX & Product</option>
                <option value="Mobile Dev">Mobile Dev</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 mb-1.5 block">Tagline (Quick pitch)</label>
              <input 
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 mb-1.5 block">Full Bio & Journey</label>
              <textarea 
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 mb-2 block">Collaboration Goals</label>
              <div className="flex flex-wrap gap-1.5">
                {availableIntents.map((intent, idx) => {
                  const isSelected = selectedIntents.includes(intent);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleIntent(intent)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 border ${
                        isSelected 
                          ? 'bg-indigo-600 border-indigo-500 text-white' 
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                      {intent}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <TechCard profile={currentUser} isExpanded={true} showSynergy={false} />
          </div>
        )}
      </div>
    </div>
  );
}
