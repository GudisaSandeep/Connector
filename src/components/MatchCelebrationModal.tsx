'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { TechProfile } from '@/types';
import { 
  Flame, 
  Send, 
  X, 
  Sparkles, 
  Code2, 
  Check,
  User
} from 'lucide-react';

interface MatchCelebrationModalProps {
  isOpen: boolean;
  matchedProfile: TechProfile | null;
  currentUserAvatar?: string;
  onClose: () => void;
  onStartChat: (profile: TechProfile, initialMessage: string) => void;
}

export function MatchCelebrationModal({
  isOpen,
  matchedProfile,
  currentUserAvatar,
  onClose,
  onStartChat
}: MatchCelebrationModalProps) {
  const [selectedIcebreaker, setSelectedIcebreaker] = useState<string>('');
  const [customMessage, setCustomMessage] = useState('');

  useEffect(() => {
    if (isOpen && matchedProfile) {
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#FD297B', '#FF5864', '#FF7854', '#20D5A0', '#2DB1FF']
        });
      } catch (e) {
        // ignore
      }

      const firstName = matchedProfile.name ? matchedProfile.name.split(' ')[0] : 'there';
      const featuredProject = matchedProfile.github?.featuredRepos?.[0]?.title;
      const projectRef = featuredProject ? `your ${featuredProject} project` : 'your projects';

      const defaultPrompts = [
        `Hey ${firstName}! Saw ${projectRef} — want to team up for upcoming hackathons? 🚀`,
        `Your ${matchedProfile.primaryRole || 'tech'} stack with my chops would make a killer project! 🔥`,
        `Hey! I'm prepping for hackathons and projects. Would love to connect and collab!`
      ];
      setSelectedIcebreaker(defaultPrompts[0]);
    }
  }, [isOpen, matchedProfile]);

  if (!isOpen || !matchedProfile) return null;

  const handleSend = () => {
    const textToSend = customMessage.trim() || selectedIcebreaker;
    onStartChat(matchedProfile, textToSend);
    onClose();
  };

  const myAvatar = currentUserAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';
  const theirAvatar = matchedProfile.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-sm bg-[#12141c] border border-white/10 rounded-3xl p-6 shadow-2xl text-center overflow-hidden">
        {/* Glow behind avatars */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#FD297B]/25 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tinder-Style "IT'S A MATCH!" */}
        <div className="mt-2 mb-6">
          <h1 className="text-3xl sm:text-4xl font-black italic tracking-tighter bg-gradient-to-r from-[#FD297B] via-[#FF5864] to-[#FF7854] bg-clip-text text-transparent transform -rotate-3">
            It's a Match!
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            You and <span className="font-bold text-white">{matchedProfile.name}</span> connected
          </p>
        </div>

        {/* Dual Avatars */}
        <div className="flex items-center justify-center -space-x-4 my-6">
          <div className="relative z-10 w-20 h-20 rounded-full overflow-hidden border-3 border-[#12141c] ring-2 ring-[#FD297B] shadow-xl bg-black/40">
            {myAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={myAvatar} 
                alt="Your Avatar" 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-slate-400 m-auto mt-4" />
            )}
          </div>
          <div className="relative z-20 w-20 h-20 rounded-full overflow-hidden border-3 border-[#12141c] ring-2 ring-[#20D5A0] shadow-xl bg-black/40">
            {theirAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={theirAvatar} 
                alt={matchedProfile.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-slate-400 m-auto mt-4" />
            )}
          </div>
        </div>

        {/* Synergy Explanation */}
        {matchedProfile.synergyScore && (
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-left mb-4">
            <div className="flex items-center gap-1 font-bold text-[#FF7854] mb-0.5">
              <Flame className="w-3.5 h-3.5 fill-[#FF7854]" />
              <span>{matchedProfile.synergyScore}% Tech Synergy</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {matchedProfile.synergyReason || 'Great complementary skill sets for building software together.'}
            </p>
          </div>
        )}

        {/* Quick Message Input */}
        <div className="space-y-2 mb-6 text-left">
          <label className="text-[10px] uppercase font-bold text-slate-400">Say something nice:</label>
          <input 
            type="text"
            value={customMessage || selectedIcebreaker}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Type your message..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FD297B]"
          />
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={handleSend}
            className="w-full py-3.5 rounded-full tinder-gradient text-white text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-[#FD297B]/30 hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send Message
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-full bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white text-xs font-bold transition-colors"
          >
            Keep Swiping
          </button>
        </div>
      </div>
    </div>
  );
}
