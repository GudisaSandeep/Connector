'use client';

import React from 'react';
import { TechProfile } from '@/types';
import { 
  Flame, 
  SlidersHorizontal, 
  MessageCircle,
  User,
  LogOut,
  Radar
} from 'lucide-react';

interface NavbarProps {
  currentUser?: TechProfile;
  onOpenProfile: () => void;
  onOpenFilters: () => void;
  onOpenMatches: () => void;
  onOpenRadar?: () => void;
  onLogout?: () => void;
  matchesCount: number;
  activeFilterCount: number;
}

export function Navbar({
  currentUser,
  onOpenProfile,
  onOpenFilters,
  onOpenMatches,
  onOpenRadar,
  onLogout,
  matchesCount,
  activeFilterCount
}: NavbarProps) {
  const avatarUrl = currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b0d13]/90 backdrop-blur-md border-b border-white/5 select-none">
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left: User Profile Icon */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenProfile}
            className="relative p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title="My Dev Profile"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/20 hover:border-[#FD297B] transition-colors bg-black/40 flex items-center justify-center">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={avatarUrl} 
                  alt={currentUser?.name || 'Profile'}
                  className="w-full h-full object-cover" 
                />
              ) : (
                <User className="w-4 h-4 text-slate-400" />
              )}
            </div>
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="p-1.5 rounded-full hover:bg-red-500/15 text-slate-500 hover:text-red-400 transition-colors"
              title="Log Out of Profile"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Center: Official Tinder-Style Flame Logo & Brand */}
        <div className="flex items-center gap-1.5 cursor-pointer">
          <div className="w-8 h-8 rounded-xl tinder-gradient flex items-center justify-center shadow-md shadow-[#FD297B]/25">
            <Flame className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-[#FD297B] via-[#FF5864] to-[#FF7854] bg-clip-text text-transparent">
            connecter
          </span>
        </div>

        {/* Right: AI Scout Radar, Filters & Matches */}
        <div className="flex items-center gap-1">
          {/* Autonomous AI Scout Radar Button */}
          {onOpenRadar && (
            <button
              onClick={onOpenRadar}
              className="p-2 rounded-full text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 transition-colors relative"
              title="Autonomous Webcmd AI Scout (Nearby & Non-registered builders)"
            >
              <Radar className="w-5 h-5 animate-spin" style={{ animationDuration: '10s' }} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </button>
          )}

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
