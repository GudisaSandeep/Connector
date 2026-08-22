'use client';

import React, { useState } from 'react';
import { TechProfile } from '@/types';
import { GithubIcon, LinkedinIcon } from './icons';
import { 
  GraduationCap, 
  MapPin, 
  Flame, 
  Star, 
  Code2, 
  Zap, 
  CheckCircle2, 
  ArrowUp,
  ArrowDown,
  Globe,
  Briefcase,
  Terminal,
  Trophy,
  Sparkles,
  Award,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface TechCardProps {
  profile: TechProfile;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  showSynergy?: boolean;
}

export function TechCard({
  profile,
  isExpanded: controlledExpanded,
  onToggleExpand,
  showSynergy = true
}: TechCardProps) {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);

  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  const toggleExpand = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onToggleExpand) {
      onToggleExpand();
    } else {
      setInternalExpanded(!internalExpanded);
    }
  };

  // Story media segments (Avatar/Cover, GitHub repo highlight, LinkedIn experience)
  const segments = [
    { type: 'photo', url: profile.avatar },
    { type: 'cover', url: profile.coverImage || profile.avatar },
  ];

  const handleNextSegment = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeSegmentIndex < segments.length - 1) {
      setActiveSegmentIndex(prev => prev + 1);
    }
  };

  const handlePrevSegment = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeSegmentIndex > 0) {
      setActiveSegmentIndex(prev => prev - 1);
    }
  };

  const currentImage = segments[activeSegmentIndex]?.url || profile.avatar;

  return (
    <div className="relative w-full h-[520px] sm:h-[560px] rounded-3xl overflow-hidden shadow-2xl bg-neutral-900 border border-white/10 select-none flex flex-col justify-end text-white">
      {/* Background Image with Dark Gradient Scrim */}
      <div className="absolute inset-0 z-0">
        <img 
          src={currentImage} 
          alt={profile.name}
          className="w-full h-full object-cover object-center transition-all duration-300"
        />
        
        {/* Tinder Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
      </div>

      {/* Segmented Story Bars at Top (Tinder Style) */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center gap-1.5 pointer-events-none">
        {segments.map((_, idx) => (
          <div 
            key={idx} 
            className="h-1 flex-1 rounded-full overflow-hidden bg-white/30 backdrop-blur-sm transition-all"
          >
            <div 
              className={`h-full bg-white transition-all duration-300 ${
                idx === activeSegmentIndex ? 'w-full' : idx < activeSegmentIndex ? 'w-full bg-white/70' : 'w-0'
              }`}
            />
          </div>
        ))}
      </div>

      {/* Left/Right Tap Targets to Change Story Image */}
      {!isExpanded && (
        <div className="absolute inset-0 z-10 grid grid-cols-2">
          <div 
            className="h-3/4 cursor-pointer" 
            onClick={handlePrevSegment}
            title="Previous item"
          />
          <div 
            className="h-3/4 cursor-pointer" 
            onClick={handleNextSegment}
            title="Next item"
          />
        </div>
      )}

      {/* Synergy Badge at Top-Right */}
      {showSynergy && profile.synergyScore && (
        <div className="absolute top-7 right-3.5 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white font-bold text-xs shadow-lg">
          <Flame className="w-4 h-4 fill-[#FF7854] text-[#FD297B]" />
          <span className="bg-gradient-to-r from-[#FD297B] to-[#FF7854] bg-clip-text text-transparent">
            {profile.synergyScore}% Match
          </span>
        </div>
      )}

      {/* Role Pill at Top-Left */}
      <div className="absolute top-7 left-3.5 z-20">
        <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs font-semibold text-white/90 flex items-center gap-1.5 shadow-md">
          <Code2 className="w-3.5 h-3.5 text-[#2DB1FF]" />
          {profile.primaryRole}
        </span>
      </div>

      {/* Card Bottom Overlay (Collapsed View) */}
      {!isExpanded ? (
        <div className="relative z-20 p-5 pt-0 space-y-2.5 pointer-events-auto">
          {/* Name, Year & Verified Check */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                {profile.name}
              </h2>
              <span className="text-2xl font-normal text-white/80 font-mono">
                '{String(profile.graduationYear).slice(2)}
              </span>
              {profile.linkedin.verifiedStudent && (
                <div className="bg-[#2DB1FF] text-white p-0.5 rounded-full shadow-sm" title="Verified Student">
                  <CheckCircle2 className="w-4 h-4 fill-[#2DB1FF] text-black" />
                </div>
              )}
            </div>

            {/* Info Drawer Button (Tinder Style Up Arrow) */}
            <button
              onClick={toggleExpand}
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg"
              title="Open full profile"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>

          {/* University & Location */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/90 font-medium drop-shadow">
            <span className="flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-white/80" />
              {profile.university} • {profile.major}
            </span>
            <span className="flex items-center gap-1 text-white/70">
              <MapPin className="w-3.5 h-3.5 text-[#FF7854]" />
              {profile.location}
            </span>
          </div>

          {/* Quick Tagline */}
          <p className="text-xs text-white/90 line-clamp-2 leading-relaxed drop-shadow">
            "{profile.tagline}"
          </p>

          {/* Tech Stack Pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {profile.skills.languages.slice(0, 3).map((lang, idx) => (
              <span 
                key={idx} 
                className="px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-mono font-medium text-white shadow-sm"
              >
                {lang}
              </span>
            ))}
            {profile.skills.frameworks.slice(0, 2).map((fw, idx) => (
              <span 
                key={idx} 
                className="px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-mono font-medium text-white shadow-sm"
              >
                {fw}
              </span>
            ))}
          </div>
        </div>
      ) : (
        /* Expandable Full Profile Drawer */
        <div className="absolute inset-0 z-30 bg-[#12141c]/95 backdrop-blur-xl p-5 overflow-y-auto custom-scrollbar flex flex-col justify-between animate-in slide-in-from-bottom duration-300">
          <div className="space-y-4">
            {/* Header with Close Down Arrow */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">{profile.name}, '{String(profile.graduationYear).slice(2)}</h3>
                  {profile.linkedin.verifiedStudent && (
                    <CheckCircle2 className="w-4 h-4 text-[#2DB1FF]" />
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{profile.university} • {profile.major}</p>
              </div>

              <button
                onClick={toggleExpand}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Collapse Profile"
              >
                <ArrowDown className="w-5 h-5" />
              </button>
            </div>

            {/* Synergy Breakdown */}
            {profile.synergyReason && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#FD297B]/15 to-[#FF7854]/15 border border-[#FD297B]/30 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-[#FF7854] mb-1">
                  <Flame className="w-4 h-4 fill-[#FF7854]" />
                  {profile.synergyScore}% Synergy Match
                </div>
                <p className="text-slate-200 text-[11px] leading-relaxed">
                  {profile.synergyReason}
                </p>
              </div>
            )}

            {/* About Bio */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">About Me</h4>
              <p className="text-xs text-slate-200 leading-relaxed bg-white/5 p-3 rounded-2xl border border-white/10">
                {profile.bio}
              </p>
            </div>

            {/* Intents */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Looking For</h4>
              <div className="flex flex-wrap gap-1.5">
                {profile.intents.map((intent, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1 rounded-full bg-[#FD297B]/20 border border-[#FD297B]/40 text-xs font-medium text-pink-200"
                  >
                    {intent === 'Hackathon Teammate' ? '🏆 ' : intent === 'Startup Co-Founder' ? '🚀 ' : '🤝 '}
                    {intent}
                  </span>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Skills & Technologies</h4>
              <div className="flex flex-wrap gap-1.5">
                {profile.skills.languages.map((l, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-xl bg-white/10 text-xs font-mono text-cyan-300 border border-white/10">
                    {l}
                  </span>
                ))}
                {profile.skills.frameworks.map((f, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-xl bg-white/10 text-xs font-mono text-purple-300 border border-white/10">
                    {f}
                  </span>
                ))}
                {profile.skills.toolsAndCloud.map((t, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-xl bg-white/10 text-xs font-mono text-emerald-300 border border-white/10">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* GitHub Stats */}
            {profile.github && (
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                  <span className="flex items-center gap-1.5">
                    <GithubIcon className="w-4 h-4 text-white" />
                    GitHub Activity (@{profile.github.username})
                  </span>
                  <span className="text-emerald-400 font-mono">{profile.github.currentStreakDays}d streak</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs py-1">
                  <div className="p-2 rounded-xl bg-black/40">
                    <div className="text-[10px] text-slate-400">Repos</div>
                    <div className="font-bold text-white font-mono mt-0.5">{profile.github.reposCount}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-black/40">
                    <div className="text-[10px] text-slate-400">Stars</div>
                    <div className="font-bold text-amber-300 font-mono mt-0.5">{profile.github.starsCount}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-black/40">
                    <div className="text-[10px] text-slate-400">Commits</div>
                    <div className="font-bold text-cyan-300 font-mono mt-0.5">{profile.github.totalCommitsThisYear}</div>
                  </div>
                </div>

                {profile.github.featuredRepos?.[0] && (
                  <div className="pt-2 border-t border-white/10">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Featured Project:</div>
                    <div className="text-xs font-mono font-bold text-indigo-300 mt-0.5">
                      {profile.github.featuredRepos[0].title}
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      {profile.github.featuredRepos[0].description}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* LinkedIn Experience */}
            {profile.linkedin?.pastInternships && profile.linkedin.pastInternships.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400">
                  <LinkedinIcon className="w-4 h-4 text-blue-400" />
                  Past Roles & Internships
                </div>
                {profile.linkedin.pastInternships.map((job, idx) => (
                  <div key={idx} className="text-xs text-slate-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    {job}
                  </div>
                ))}
              </div>
            )}
            {/* Custom Links & Online Footprints */}
            {profile.customLinks && profile.customLinks.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Featured Links & Profiles
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.customLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-slate-200 hover:text-white border border-white/15 flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Globe className="w-3.5 h-3.5 text-[#2DB1FF]" />
                      <span>{link.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Social Links & Bottom Close */}
          <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {profile.socials.github && (
                <a 
                  href={profile.socials.github.startsWith('http') ? profile.socials.github : `https://github.com/${profile.socials.github}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="GitHub Profile"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>
              )}
              {profile.socials.linkedin && (
                <a 
                  href={profile.socials.linkedin.startsWith('http') ? profile.socials.linkedin : `https://linkedin.com/in/${profile.socials.linkedin}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-blue-400 transition-colors"
                  title="LinkedIn Profile"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>
              )}
              {profile.socials.portfolio && (
                <a 
                  href={profile.socials.portfolio.startsWith('http') ? profile.socials.portfolio : `https://${profile.socials.portfolio}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-purple-400 transition-colors"
                  title="Portfolio Website"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>

            <button
              onClick={toggleExpand}
              className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-colors"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
