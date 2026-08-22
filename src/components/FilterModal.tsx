'use client';

import React, { useState } from 'react';
import { FilterPreferences, IntentType } from '@/types';
import { X, SlidersHorizontal, Sparkles, Check, MapPin, Navigation, RefreshCw } from 'lucide-react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterPreferences;
  onApplyFilters: (newFilters: FilterPreferences) => void;
  onResetFilters: () => void;
}

export function FilterModal({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters
}: FilterModalProps) {
  const [localFilters, setLocalFilters] = useState<FilterPreferences>(filters);
  const [isDetectingGps, setIsDetectingGps] = useState(false);

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters, isOpen]);

  if (!isOpen) return null;

  const allIntents: IntentType[] = [
    'Hackathon Teammate',
    'Startup Co-Founder',
    'LeetCode / DSA Partner',
    'Open-Source Collaborator',
    'Project Peer Review'
  ];

  const allRoles = [
    'AI / ML Engineer',
    'Full-Stack',
    'Frontend',
    'Backend',
    'Systems / DevOps',
    'UI/UX & Product',
    'Mobile Dev'
  ];

  const popularStacks = [
    'PyTorch', 'Next.js', 'Rust', 'Go', 'TypeScript', 'Python', 'Three.js', 'Flutter', 'Kubernetes', 'FastAPI', 'C++'
  ];

  const handleDetectGps = () => {
    if ('geolocation' in navigator) {
      setIsDetectingGps(true);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=12`);
            if (res.ok) {
              const data = await res.json();
              const addr = data.address || {};
              const city = addr.city || addr.town || addr.municipality || addr.village || addr.county || 'Local Area';
              const state = addr.state || '';
              const detected = `${city}${state ? `, ${state}` : ''}`;
              setLocalFilters(prev => ({ ...prev, locationQuery: detected }));
            }
          } catch (e) {}
          setIsDetectingGps(false);
        },
        () => {
          setIsDetectingGps(false);
        },
        { timeout: 8000 }
      );
    }
  };

  const toggleIntent = (intent: IntentType) => {
    setLocalFilters(prev => ({
      ...prev,
      intents: prev.intents.includes(intent)
        ? prev.intents.filter(i => i !== intent)
        : [...prev.intents, intent]
    }));
  };

  const toggleRole = (role: string) => {
    setLocalFilters(prev => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role]
    }));
  };

  const toggleTech = (tech: string) => {
    setLocalFilters(prev => ({
      ...prev,
      techStack: prev.techStack.includes(tech)
        ? prev.techStack.filter(t => t !== tech)
        : [...prev.techStack, tech]
    }));
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-md bg-[#12141c] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-[#FD297B]" />
            <h3 className="font-bold text-base text-white">Discovery Filters</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Location & Campus Search Filter */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#FF7854]" />
              Target Campus or City
            </label>
            <button
              type="button"
              onClick={handleDetectGps}
              disabled={isDetectingGps}
              className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <Navigation className={`w-3 h-3 ${isDetectingGps ? 'animate-spin' : ''}`} />
              Auto-Detect GPS
            </button>
          </div>

          <input 
            type="text"
            placeholder="e.g. Christ University / Bangalore / Stanford"
            value={localFilters.locationQuery || ''}
            onChange={(e) => setLocalFilters(prev => ({ ...prev, locationQuery: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FD297B]"
          />
        </div>

        {/* Intent Filters */}
        <div>
          <label className="text-xs font-bold text-slate-300 mb-2 block">
            Collaboration Intent
          </label>
          <div className="flex flex-wrap gap-1.5">
            {allIntents.map((intent, idx) => {
              const isSelected = localFilters.intents.includes(intent);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleIntent(intent)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 border ${
                    isSelected 
                      ? 'bg-[#FD297B]/20 border-[#FD297B] text-pink-200 shadow-md' 
                      : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                  {intent}
                </button>
              );
            })}
          </div>
        </div>

        {/* Role Filters */}
        <div>
          <label className="text-xs font-bold text-slate-300 mb-2 block">
            Target Roles & Disciplines
          </label>
          <div className="grid grid-cols-2 gap-2">
            {allRoles.map((role, idx) => {
              const isSelected = localFilters.roles.includes(role);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleRole(role)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-medium transition-all border flex items-center justify-between ${
                    isSelected 
                      ? 'bg-[#2DB1FF]/20 border-[#2DB1FF] text-blue-200 shadow-md' 
                      : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <span className="truncate">{role}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#2DB1FF]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tech Stack Filter */}
        <div>
          <label className="text-xs font-bold text-slate-300 mb-2 block">
            Specific Technologies
          </label>
          <div className="flex flex-wrap gap-1.5">
            {popularStacks.map((tech, idx) => {
              const isSelected = localFilters.techStack.includes(tech);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleTech(tech)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all border ${
                    isSelected 
                      ? 'bg-[#20D5A0]/20 border-[#20D5A0] text-emerald-300' 
                      : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  {tech}
                </button>
              );
            })}
          </div>
        </div>

        {/* Synergy Slider */}
        <div>
          <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
            <span>Minimum Match Synergy</span>
            <span className="font-mono text-[#FF7854] font-bold">{localFilters.minSynergyScore}%+</span>
          </div>
          <input 
            type="range" 
            min="60" 
            max="95" 
            step="5"
            value={localFilters.minSynergyScore}
            onChange={(e) => setLocalFilters({ ...localFilters, minSynergyScore: Number(e.target.value) })}
            className="w-full accent-[#FD297B] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
            <span>60% (All Peers)</span>
            <span>80% (Complementary)</span>
            <span>95% (Elite Synergy)</span>
          </div>
        </div>

        {/* Remote Available Checkbox */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
          <div>
            <div className="text-xs font-bold text-white">Remote Collaboration Only</div>
            <div className="text-[10px] text-slate-400">Filter students open to remote hackathons</div>
          </div>
          <input 
            type="checkbox"
            checked={localFilters.remoteOnly}
            onChange={(e) => setLocalFilters({ ...localFilters, remoteOnly: e.target.checked })}
            className="w-4 h-4 accent-[#FD297B] cursor-pointer rounded"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              onResetFilters();
              onClose();
            }}
            className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-semibold transition-colors"
          >
            Reset All
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 py-3 rounded-full tinder-gradient text-white text-xs font-bold shadow-lg shadow-[#FD297B]/25 hover:opacity-95 transition-all"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
