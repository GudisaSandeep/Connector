'use client';

import React from 'react';
import { FilterPreferences, IntentType } from '@/types';
import { X, SlidersHorizontal, Sparkles, Check } from 'lucide-react';

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
  const [localFilters, setLocalFilters] = React.useState<FilterPreferences>(filters);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-base text-white">Discovery Filters</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
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
                  onClick={() => toggleIntent(intent)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 border ${
                    isSelected 
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-md' 
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
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
          <div className="flex flex-wrap gap-1.5">
            {allRoles.map((role, idx) => {
              const isSelected = localFilters.roles.includes(role);
              return (
                <button
                  key={idx}
                  onClick={() => toggleRole(role)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 border ${
                    isSelected 
                      ? 'bg-cyan-600 border-cyan-500 text-white shadow-md' 
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                  {role}
                </button>
              );
            })}
          </div>
        </div>

        {/* Preferred Tech Stack */}
        <div>
          <label className="text-xs font-bold text-slate-300 mb-2 block">
            Key Tech & Frameworks
          </label>
          <div className="flex flex-wrap gap-1.5">
            {popularStacks.map((tech, idx) => {
              const isSelected = localFilters.techStack.includes(tech);
              return (
                <button
                  key={idx}
                  onClick={() => toggleTech(tech)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all border ${
                    isSelected 
                      ? 'bg-purple-600 border-purple-500 text-white' 
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {tech}
                </button>
              );
            })}
          </div>
        </div>

        {/* Min Synergy Score */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1.5">
            <span>Minimum Match Synergy</span>
            <span className="font-mono text-amber-400 font-bold">{localFilters.minSynergyScore}%+</span>
          </div>
          <input 
            type="range" 
            min="60" 
            max="95" 
            step="5"
            value={localFilters.minSynergyScore}
            onChange={(e) => setLocalFilters({ ...localFilters, minSynergyScore: Number(e.target.value) })}
            className="w-full accent-indigo-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
            <span>60% (All Peers)</span>
            <span>80% (Complementary)</span>
            <span>95% (Elite Synergy)</span>
          </div>
        </div>

        {/* Remote Available Checkbox */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
          <div>
            <div className="text-xs font-bold text-white">Remote Collaboration Only</div>
            <div className="text-[10px] text-slate-500">Filter students open to remote hackathons</div>
          </div>
          <input 
            type="checkbox"
            checked={localFilters.remoteOnly}
            onChange={(e) => setLocalFilters({ ...localFilters, remoteOnly: e.target.checked })}
            className="w-4 h-4 accent-indigo-500 cursor-pointer rounded"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => {
              onResetFilters();
              onClose();
            }}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Reset All
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
