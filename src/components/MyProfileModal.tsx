'use client';

import React, { useState } from 'react';
import { TechProfile, IntentType } from '@/types';
import { TechCard } from './TechCard';
import { GithubIcon, LinkedinIcon } from './icons';
import { 
  X, 
  User, 
  Edit3, 
  Check, 
  Sparkles, 
  Code2, 
  GraduationCap, 
  MapPin,
  Flame,
  Globe,
  Plus
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
  
  // Socials & Custom Links
  const [githubUser, setGithubUser] = useState(currentUser.socials.github || '');
  const [linkedinUrl, setLinkedinUrl] = useState(currentUser.socials.linkedin || '');
  const [portfolioUrl, setPortfolioUrl] = useState(currentUser.socials.portfolio || '');
  const [customLinks, setCustomLinks] = useState<{ label: string; url: string }[]>(currentUser.customLinks || []);
  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  if (!isOpen) return null;

  const availableIntents: IntentType[] = [
    'Hackathon Teammate',
    'Startup Co-Founder',
    'LeetCode / DSA Partner',
    'Open-Source Collaborator',
    'Project Peer Review'
  ];

  const handleAddCustomLink = () => {
    if (newLinkLabel.trim() && newLinkUrl.trim()) {
      setCustomLinks(prev => [...prev, { label: newLinkLabel.trim(), url: newLinkUrl.trim() }]);
      setNewLinkLabel('');
      setNewLinkUrl('');
    }
  };

  const handleRemoveCustomLink = (index: number) => {
    setCustomLinks(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onUpdateProfile({
      ...currentUser,
      tagline,
      bio,
      intents: selectedIntents,
      primaryRole: primaryRole as any,
      socials: {
        ...currentUser.socials,
        github: githubUser.trim(),
        linkedin: linkedinUrl.trim(),
        portfolio: portfolioUrl.trim()
      },
      customLinks: customLinks.length > 0 ? customLinks : undefined
    });
    setIsEditing(false);
  };

  const toggleIntent = (intent: IntentType) => {
    setSelectedIntents(prev => 
      prev.includes(intent) ? prev.filter(i => i !== intent) : [...prev, intent]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-2xl bg-[#12141c] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto custom-scrollbar text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FD297B]/15 text-[#FD297B] border border-[#FD297B]/30">
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
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-white/10 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Preview Card' : 'Edit Details'}</span>
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4 text-xs">
            <div>
              <label className="text-xs font-bold text-slate-300 mb-1.5 block">Primary Discipline</label>
              <select
                value={primaryRole}
                onChange={(e) => setPrimaryRole(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-100 font-mono focus:outline-none focus:border-[#FD297B]"
              >
                <option value="Full-Stack" className="bg-slate-900">Full-Stack</option>
                <option value="AI / ML Engineer" className="bg-slate-900">AI / ML Engineer</option>
                <option value="Frontend" className="bg-slate-900">Frontend</option>
                <option value="Backend" className="bg-slate-900">Backend</option>
                <option value="Systems / DevOps" className="bg-slate-900">Systems / DevOps</option>
                <option value="UI/UX & Product" className="bg-slate-900">UI/UX & Product</option>
                <option value="Mobile Dev" className="bg-slate-900">Mobile Dev</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 mb-1.5 block">Tagline (Quick pitch)</label>
              <input 
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-[#FD297B]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 mb-1.5 block">Full Bio & Journey</label>
              <textarea 
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-[#FD297B] resize-none"
              />
            </div>

            {/* Social Links & Custom Links */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <span className="font-bold text-white block">Social Profiles & Portfolio</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                    <GithubIcon className="w-3 h-3 text-white" />
                    GitHub
                  </label>
                  <input 
                    type="text"
                    value={githubUser}
                    onChange={(e) => setGithubUser(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                    <LinkedinIcon className="w-3 h-3 text-blue-400" />
                    LinkedIn
                  </label>
                  <input 
                    type="text"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                    <Globe className="w-3 h-3 text-purple-400" />
                    Portfolio
                  </label>
                  <input 
                    type="text"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono"
                  />
                </div>
              </div>

              {/* Custom Links Adder */}
              <div className="pt-2 border-t border-white/10 space-y-2">
                <span className="text-[11px] font-bold text-slate-300 block">Custom Showcase Links</span>
                <div className="flex items-center gap-2">
                  <input 
                    type="text"
                    placeholder="Label (Devpost, LeetCode, etc.)"
                    value={newLinkLabel}
                    onChange={(e) => setNewLinkLabel(e.target.value)}
                    className="w-1/3 px-2.5 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                  />
                  <input 
                    type="text"
                    placeholder="URL (https://...)"
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomLink}
                    className="p-1.5 rounded-xl bg-[#20D5A0]/20 text-[#20D5A0] border border-[#20D5A0]/30"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {customLinks.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {customLinks.map((l, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-xl bg-white/10 border border-white/15 text-[11px] flex items-center gap-1.5">
                        <strong className="text-white">{l.label}:</strong>
                        <span className="text-slate-400 font-mono truncate max-w-[120px]">{l.url}</span>
                        <button type="button" onClick={() => handleRemoveCustomLink(i)} className="text-slate-400 hover:text-red-400">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
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
                          ? 'bg-[#FD297B]/20 border-[#FD297B] text-pink-200' 
                          : 'bg-white/5 border-white/10 text-slate-400'
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
                className="px-4 py-2 rounded-xl bg-white/10 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-2.5 rounded-full tinder-gradient text-white text-xs font-bold shadow-md hover:opacity-95"
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
