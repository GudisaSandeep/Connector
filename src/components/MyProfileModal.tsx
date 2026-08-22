'use client';

import React, { useState, useRef } from 'react';
import { TechProfile, IntentType } from '@/types';
import { TechCard } from './TechCard';
import { GithubIcon, LinkedinIcon } from './icons';
import { parseResumeFile } from '@/lib/resumeParser';
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
  Plus,
  Upload,
  FileText,
  FileCheck2,
  Image as ImageIcon
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
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatar || '');
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
  const [resumeNotice, setResumeNotice] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const availableIntents: IntentType[] = [
    'Hackathon Teammate',
    'Startup Co-Founder',
    'LeetCode / DSA Partner',
    'Open-Source Collaborator',
    'Project Peer Review'
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeFile = async (file: File) => {
    try {
      const result = await parseResumeFile(file);
      if (result.extractedSkills.length > 0) {
        if (result.suggestedRole) {
          setPrimaryRole(result.suggestedRole);
        }
        setResumeNotice(`✨ Re-synced ${result.extractedSkills.length} skills from ${file.name}!`);
      }
    } catch (e) {
      setResumeNotice('📄 Resume attached.');
    }
  };

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
      avatar: avatarUrl || currentUser.avatar,
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
              <p className="text-xs text-slate-400">Live card shown on the discovery deck</p>
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
            {/* Profile Photo Upload */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3.5">
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-black/40 border border-white/10 flex-shrink-0 flex items-center justify-center">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-slate-500" />
                )}
              </div>

              <div className="flex-1 space-y-1">
                <span className="text-xs font-bold text-white block">Profile Picture</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Photo</span>
                  </button>
                  <input 
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <input 
                    type="text"
                    placeholder="Or image URL..."
                    value={avatarUrl.startsWith('data:') ? '' : avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* Resume Drop Zone for Skill Re-sync */}
            <div 
              onClick={() => resumeInputRef.current?.click()}
              className="p-3.5 rounded-2xl border-2 border-dashed border-white/20 hover:border-[#20D5A0] bg-white/5 hover:bg-[#20D5A0]/5 transition-all cursor-pointer flex items-center gap-3"
            >
              <input 
                ref={resumeInputRef}
                type="file"
                accept=".pdf,.docx,.txt,.json,.doc"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleResumeFile(e.target.files[0]);
                }}
                className="hidden"
              />
              <div className="p-2 rounded-xl bg-white/10 text-[#20D5A0]">
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <span className="font-bold text-white block">Drop New Resume (PDF / DOCX)</span>
                <span className="text-[11px] text-slate-400">Re-scans resume for updated skills and role recommendations.</span>
              </div>
              {resumeNotice && (
                <span className="text-[11px] text-emerald-400 font-semibold">{resumeNotice}</span>
              )}
            </div>

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
