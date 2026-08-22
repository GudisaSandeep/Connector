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
  ChevronRight,
  ExternalLink,
  Mail,
  User
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
  const [imageFailed, setImageFailed] = useState(false);

  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  const toggleExpand = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onToggleExpand) {
      onToggleExpand();
    } else {
      setInternalExpanded(!internalExpanded);
    }
  };

  const segments = [
    { type: 'photo', label: 'Photo' },
    { type: 'github', label: 'GitHub' },
    { type: 'skills', label: 'Stack' }
  ];

  const handleNextSegment = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSegmentIndex((prev) => (prev + 1) % segments.length);
  };

  const handlePrevSegment = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSegmentIndex((prev) => (prev - 1 + segments.length) % segments.length);
  };

  const githubUrl = profile.socials?.github || (profile.github?.username ? `https://github.com/${profile.github.username}` : undefined);
  const linkedinUrl = profile.socials?.linkedin && profile.socials.linkedin.includes('linkedin.com') ? profile.socials.linkedin : undefined;
  const portfolioUrl = profile.socials?.portfolio && (profile.socials.portfolio.startsWith('http') || profile.socials.portfolio.includes('.')) 
    ? (profile.socials.portfolio.startsWith('http') ? profile.socials.portfolio : `https://${profile.socials.portfolio}`) 
    : undefined;

  // Real avatar or high-res GitHub image
  const avatarSrc = profile.avatar || (profile.github?.username ? `https://github.com/${profile.github.username}.png?size=400` : undefined);

  return (
    <div className="relative w-full h-[540px] sm:h-[580px] rounded-3xl overflow-hidden bg-[#12141c] border border-white/10 shadow-2xl flex flex-col justify-between select-none">
      {/* Background Image or Stylish Developer Banner Fallback */}
      <div className="absolute inset-0 z-0">
        {avatarSrc && !imageFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={avatarSrc} 
            alt={profile.name}
            onError={() => setImageFailed(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          /* Developer Banner Fallback with Geometric Glow */
          <div className="w-full h-full bg-gradient-to-br from-[#1a1c29] via-[#0f1118] to-[#251532] flex flex-col items-center justify-center relative p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(253,41,123,0.2),transparent_70%)] pointer-events-none" />
            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#FD297B] to-[#FF7854] flex items-center justify-center text-4xl font-extrabold text-white shadow-2xl border-4 border-white/20 z-10">
              {profile.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="mt-4 text-center z-10">
              <span className="font-mono text-xs text-[#2DB1FF] font-bold tracking-wider uppercase block">
                {profile.primaryRole}
              </span>
              <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                {profile.handle}
              </span>
            </div>
          </div>
        )}
        {/* Tinder Dark Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d13] via-[#0b0d13]/50 to-black/30" />
      </div>

      {/* Top Instagram / Tinder Story Progress Bars */}
      <div className="relative z-20 px-3 pt-3 flex gap-1.5 pointer-events-none">
        {segments.map((_, idx) => (
          <div 
            key={idx} 
            className="flex-1 h-1 bg-white/25 rounded-full overflow-hidden backdrop-blur-sm"
          >
            <div 
              className={`h-full bg-white transition-all duration-300 ${
                idx === activeSegmentIndex ? 'w-full' : idx < activeSegmentIndex ? 'w-full opacity-60' : 'w-0'
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
              {profile.linkedin?.verifiedStudent && (
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

          {/* Tech Stack Pills & Direct Contact Quick Icons */}
          <div className="flex items-center justify-between pt-1 gap-2">
            <div className="flex flex-wrap gap-1.5 flex-1">
              {profile.skills.languages.slice(0, 3).map((lang, idx) => (
                <span 
                  key={idx} 
                  className="px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-mono font-medium text-white shadow-sm"
                >
                  {lang}
                </span>
              ))}
              {profile.skills.frameworks.slice(0, 2).map((fw, idx) => (
                <span 
                  key={idx} 
                  className="px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-mono font-medium text-white shadow-sm"
                >
                  {fw}
                </span>
              ))}
            </div>

            {/* Direct Clickable Contact Buttons on Card */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {githubUrl && (
                <a
                  href={githubUrl.startsWith('http') ? githubUrl : `https://${githubUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 rounded-xl bg-black/60 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white transition-all hover:scale-105"
                  title="View GitHub"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                </a>
              )}
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 rounded-xl bg-black/60 hover:bg-white/20 backdrop-blur-md border border-white/20 text-blue-400 transition-all hover:scale-105"
                  title="View LinkedIn"
                >
                  <LinkedinIcon className="w-3.5 h-3.5" />
                </a>
              )}
              {portfolioUrl && (
                <a
                  href={portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 rounded-xl bg-black/60 hover:bg-white/20 backdrop-blur-md border border-white/20 text-purple-400 transition-all hover:scale-105"
                  title="View Portfolio"
                >
                  <Globe className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
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
                  {profile.linkedin?.verifiedStudent && (
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

            {/* Direct Contact Links Bar */}
            {(githubUrl || linkedinUrl || portfolioUrl || (profile.customLinks && profile.customLinks.length > 0)) && (
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  Direct Verified Footprints & Links
                </span>
                <div className="flex flex-wrap gap-2">
                  {githubUrl && (
                    <a
                      href={githubUrl.startsWith('http') ? githubUrl : `https://${githubUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-black/40 hover:bg-white/15 text-xs text-white font-medium border border-white/10 flex items-center gap-1.5 transition-colors"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      <span>GitHub</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  )}
                  {linkedinUrl && (
                    <a
                      href={linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-black/40 hover:bg-white/15 text-xs text-blue-300 font-medium border border-white/10 flex items-center gap-1.5 transition-colors"
                    >
                      <LinkedinIcon className="w-3.5 h-3.5 text-blue-400" />
                      <span>LinkedIn</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  )}
                  {portfolioUrl && (
                    <a
                      href={portfolioUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-black/40 hover:bg-white/15 text-xs text-purple-300 font-medium border border-white/10 flex items-center gap-1.5 transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5 text-purple-400" />
                      <span>Portfolio</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Synergy Breakdown Card */}
            {profile.synergyScore && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#FD297B]/10 to-[#FF7854]/10 border border-[#FD297B]/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-pink-300">
                    <Sparkles className="w-4 h-4 text-[#FD297B]" />
                    AI Synergy Match Analysis
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#FD297B]/20 text-[#FD297B] font-bold text-xs font-mono">
                    {profile.synergyScore}%
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {profile.synergyReason || 'Great complementary skill sets for building software together.'}
                </p>
              </div>
            )}

            {/* Bio & Journey */}
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">About & Journey</h4>
              <p className="text-xs text-slate-200 leading-relaxed">{profile.bio}</p>
            </div>

            {/* Intent Badges */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Looking For</h4>
              <div className="flex flex-wrap gap-1.5">
                {profile.intents.map((intent, idx) => (
                  <span 
                    key={idx}
                    className="px-2.5 py-1 rounded-xl bg-[#2DB1FF]/15 border border-[#2DB1FF]/30 text-blue-200 text-xs font-medium"
                  >
                    🎯 {intent}
                  </span>
                ))}
              </div>
            </div>

            {/* Skills & Tech Stack */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Technical Arsenal</h4>
              <div className="flex flex-wrap gap-1.5">
                {profile.skills.languages.map((l, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-xl bg-white/10 text-xs font-mono text-white">
                    {l}
                  </span>
                ))}
                {profile.skills.frameworks.map((f, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-xl bg-white/10 text-xs font-mono text-emerald-300">
                    {f}
                  </span>
                ))}
                {profile.skills.toolsAndCloud.map((t, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-400">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* GitHub Verified Stats Section */}
            {profile.github && (
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                    <GithubIcon className="w-4 h-4 text-white" />
                    GitHub Pulse (@{profile.github.username})
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {profile.github.currentStreakDays} day streak
                  </span>
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

            {/* Custom Links & Online Footprints */}
            {profile.customLinks && profile.customLinks.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Featured Links & Footprints
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.customLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url.startsWith('http') || link.url.startsWith('mailto:') ? link.url : `https://${link.url}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-slate-200 hover:text-white border border-white/15 flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Globe className="w-3.5 h-3.5 text-[#2DB1FF]" />
                      <span>{link.label}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Social Links & Bottom Close */}
          <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {githubUrl && (
                <a 
                  href={githubUrl.startsWith('http') ? githubUrl : `https://${githubUrl}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="GitHub Profile"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>
              )}
              {linkedinUrl && (
                <a 
                  href={linkedinUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-blue-400 transition-colors"
                  title="LinkedIn Profile"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>
              )}
              {portfolioUrl && (
                <a 
                  href={portfolioUrl} 
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
