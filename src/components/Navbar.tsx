'use client';

import React from 'react';
import { CURRENT_USER } from '@/lib/mockData';
import { 
  Flame, 
  SlidersHorizontal, 
  MessageCircle,
  User
} from 'lucide-react';

interface NavbarProps {
  onOpenProfile: () => void;
  onOpenFilters: () => void;
  onOpenMatches: () => void;
  matchesCount: number;
  activeFilterCount: number;
}

export function Navbar({
  onOpenProfile,
  onOpenFilters,
  onOpenMatches,
  matchesCount,
  activeFilterCount
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b0d13]/90 backdrop-blur-md border-b border-white/5 select-none">
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left: User Profile Icon */}
        <button
          onClick={onOpenProfile}
          className="relative p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          title="My Dev Profile"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/20 hover:border-[#FD297B] transition-colors">
            <img 
              src={CURRENT_USER.avatar} 
              alt={CURRENT_USER.name}
              className="w-full h-full object-cover" 
            />
          </div>
        </button>

        {/* Center: Official Tinder-Style Flame Logo & Brand */}
        <div className="flex items-center gap-1.5 cursor-pointer">
          <div className="w-8 h-8 rounded-xl tinder-gradient flex items-center justify-center shadow-md shadow-[#FD297B]/25">
            <Flame className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-[#FD297B] via-[#FF5864] to-[#FF7854] bg-clip-text text-transparent">
            connecter
          </span>
        </div>

        {/* Right: Filters & Match Messages */}
        <div className="flex items-center gap-1">
          {/* Discovery Filter Button */}
          <button
            onClick={onOpenFilters}
            className={`p-2 rounded-full transition-colors relative ${
              activeFilterCount > 0 
                ? 'text-[#FD297B] bg-[#FD297B]/15' 
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            title="Discovery Settings"
          >
            <SlidersHorizontal className="w-5 h-5" />
            {activeFilterCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#FD297B]" />
            )}
          </button>

          {/* Matches & Chat Bubble */}
          <button
            onClick={onOpenMatches}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors relative"
            title="View Matches"
          >
            <MessageCircle className="w-5 h-5" />
            {matchesCount > 0 && (
              <span className="absolute top-1 right-1 px-1.5 py-0.2 rounded-full bg-[#FD297B] text-white text-[9px] font-bold font-mono shadow-sm">
                {matchesCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
