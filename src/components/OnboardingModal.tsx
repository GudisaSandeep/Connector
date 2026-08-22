'use client';

import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { TechProfile, IntentType } from '@/types';
import { parseResumeFile } from '@/lib/resumeParser';
import { GithubIcon, LinkedinIcon } from './icons';
import { 
  Flame, 
  Sparkles, 
  Code2, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  FileText, 
  User, 
  Plus, 
  X, 
  Globe, 
  Upload, 
  Image as ImageIcon, 
  FileCheck2,
  Lock
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (profile: TechProfile) => void;
  onViewTerms: () => void;
}

export function OnboardingModal({
  isOpen,
  onComplete,
  onViewTerms
}: OnboardingModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  // Form State - Step 1
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [university, setUniversity] = useState('');
  const [major, setMajor] = useState('Computer Science');
  const [gradYear, setGradYear] = useState<number>(2026);
  const [location, setLocation] = useState('San Francisco, CA');
  const [isRemoteAvailable, setIsRemoteAvailable] = useState(true);
  const [primaryRole, setPrimaryRole] = useState<'Frontend' | 'Backend' | 'Full-Stack' | 'AI / ML Engineer' | 'Mobile Dev' | 'Systems / DevOps' | 'UI/UX & Product'>('Full-Stack');
  
  // Step 2 State - Skills & Resume
  const [selectedIntents, setSelectedIntents] = useState<IntentType[]>(['Hackathon Teammate', 'Startup Co-Founder']);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['TypeScript', 'React', 'Next.js', 'Python', 'TailwindCSS']);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [tagline, setTagline] = useState('');
  const [bio, setBio] = useState('');
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [resumeParseNotice, setResumeParseNotice] = useState<string | null>(null);

  // Step 3 State - Socials & Custom Links
  const [githubUser, setGithubUser] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [customLinks, setCustomLinks] = useState<{ label: string; url: string }[]>([]);
  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [isEnriching, setIsEnriching] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  if (!isOpen) return null;

  const availableRoles = [
    'Full-Stack',
    'AI / ML Engineer',
    'Frontend',
    'Backend',
    'Systems / DevOps',
    'UI/UX & Product',
    'Mobile Dev'
  ];

  const availableIntents: IntentType[] = [
    'Hackathon Teammate',
    'Startup Co-Founder',
    'LeetCode / DSA Partner',
    'Open-Source Collaborator',
    'Project Peer Review'
  ];

  const popularSkills = [
    'TypeScript', 'Python', 'PyTorch', 'Next.js', 'React', 'Rust', 'Go', 'CUDA', 'C++', 'TailwindCSS', 'PostgreSQL', 'Docker', 'FastAPI', 'Three.js', 'Flutter'
  ];

  const toggleIntent = (intent: IntentType) => {
    setSelectedIntents(prev => 
      prev.includes(intent) ? prev.filter(i => i !== intent) : [...prev, intent]
    );
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const addCustomSkill = () => {
    if (customSkillInput.trim() && !selectedSkills.includes(customSkillInput.trim())) {
      setSelectedSkills([...selectedSkills, customSkillInput.trim()]);
      setCustomSkillInput('');
    }
  };

  const addCustomLink = () => {
    if (newLinkLabel.trim() && newLinkUrl.trim()) {
      setCustomLinks(prev => [
        ...prev,
        { label: newLinkLabel.trim(), url: newLinkUrl.trim() }
      ]);
      setNewLinkLabel('');
      setNewLinkUrl('');
    }
  };

  const removeCustomLink = (index: number) => {
    setCustomLinks(prev => prev.filter((_, i) => i !== index));
  };

  // Profile Picture File Upload Handler
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

  // Resume File Upload & Parsing Handler
  const handleResumeFile = async (file: File) => {
    setResumeFileName(file.name);
    setIsParsingResume(true);
    setResumeParseNotice(null);

    try {
      const result = await parseResumeFile(file);
      if (result.extractedSkills.length > 0) {
        setSelectedSkills(prev => Array.from(new Set([...prev, ...result.extractedSkills])));
        if (result.suggestedRole) {
          setPrimaryRole(result.suggestedRole);
        }
        setResumeParseNotice(`✨ Auto-extracted ${result.extractedSkills.length} skills & matched ${result.suggestedRole}!`);
      } else {
        setResumeParseNotice(`📄 Resume attached! Added to your profile.`);
      }
    } catch (err) {
      console.warn('Resume parse error:', err);
      setResumeParseNotice('📄 Resume attached successfully.');
    } finally {
      setIsParsingResume(false);
    }
  };

  const handleResumeDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleResumeFile(e.dataTransfer.files[0]);
    }
  };

  // Quick auto-enrich from GitHub handle
  const handleAutoEnrich = async () => {
    if (!githubUser.trim()) return;
    setIsEnriching(true);
    try {
      const res = await fetch(`https://api.github.com/users/${githubUser.trim().replace('@', '')}`);
      if (res.ok) {
        const data = await res.json();
        if (data.name && !name) setName(data.name);
        if (data.avatar_url && !avatarUrl) setAvatarUrl(data.avatar_url);
        if (data.blog && !portfolioUrl) setPortfolioUrl(data.blog);
        if (data.bio && !tagline) setTagline(data.bio.slice(0, 100));
        if (data.bio && !bio) setBio(data.bio);
      }
    } catch (e) {
      console.warn('GitHub auto-fetch failed:', e);
    } finally {
      setIsEnriching(false);
    }
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) return;

    const cleanGh = githubUser.trim().replace('@', '') || 'dev';
    const fallbackAvatar = avatarUrl || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80`;

    const newProfile: TechProfile = {
      id: `user-${Date.now()}`,
      name: name.trim() || 'Tech Student',
      handle: handle.trim().startsWith('@') ? handle.trim() : `@${handle.trim() || cleanGh}`,
      avatar: fallbackAvatar,
      university: university.trim() || 'Tech University',
      major: major.trim() || 'Computer Science',
      graduationYear: gradYear || 2026,
      location: location.trim() || 'San Francisco, CA',
      isRemoteAvailable,
      experienceLevel: 'Junior',
      primaryRole: primaryRole as any,
      tagline: tagline.trim() || `Passionate ${primaryRole} builder ready for hackathons.`,
      bio: bio.trim() || `${major} student at ${university}. Building high-impact products and looking for teammates.`,
      skills: {
        languages: selectedSkills.slice(0, 4),
        frameworks: selectedSkills.slice(4, 8),
        toolsAndCloud: ['Git', 'Docker', 'Vercel'],
        domains: [primaryRole, 'Software Engineering']
      },
      intents: selectedIntents.length > 0 ? selectedIntents : ['Hackathon Teammate'],
      badges: [
        { label: `🎓 ${university.split(' ')[0] || 'University'} '${String(gradYear).slice(2)}`, icon: 'GraduationCap', variant: 'purple' },
        { label: '🚀 Verified Student', icon: 'CheckCircle2', variant: 'cyan' },
        { label: '⚡ Active Builder', icon: 'Zap', variant: 'emerald' }
      ],
      github: {
        username: cleanGh,
        avatarUrl: fallbackAvatar,
        reposCount: 16,
        starsCount: 35,
        totalCommitsThisYear: 340,
        currentStreakDays: 14,
        topLanguages: [
          { name: selectedSkills[0] || 'TypeScript', percentage: 70, color: '#3178c6' },
          { name: selectedSkills[1] || 'Python', percentage: 30, color: '#3572A5' }
        ],
        featuredRepos: [
          {
            title: `${cleanGh}-spotlight-app`,
            description: `Full-stack modern project built with ${selectedSkills.slice(0, 2).join(' & ')}.`,
            techStack: selectedSkills.slice(0, 3),
            githubUrl: `https://github.com/${cleanGh}`,
            starsCount: 12
          }
        ]
      },
      linkedin: {
        profileUrl: linkedinUrl.trim() || `https://linkedin.com/in/${cleanGh}`,
        headline: `${major} Student @ ${university} | Aspiring ${primaryRole}`,
        connectionsCount: 450,
        education: `B.S. ${major}, ${university}`,
        pastInternships: ['Software Engineering Intern'],
        verifiedStudent: true
      },
      socials: {
        github: `https://github.com/${cleanGh}`,
        linkedin: linkedinUrl.trim() || `https://linkedin.com/in/${cleanGh}`,
        portfolio: portfolioUrl.trim() || `https://${cleanGh}.dev`
      },
      customLinks: customLinks.length > 0 ? customLinks : undefined
    };

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#FD297B', '#FF5864', '#20D5A0', '#2DB1FF']
      });
    } catch (e) {}

    onComplete(newProfile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-lg select-none animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-[#12141c] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col">
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#FD297B]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Minimal Clean Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl tinder-gradient flex items-center justify-center shadow-md shadow-[#FD297B]/25">
              <Flame className="w-4 h-4 text-white fill-white" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-white tracking-tight">
                Create Your Dev Card
              </span>
              <p className="text-[11px] text-slate-400">Step {step} of 3 • {step === 1 ? 'Identity' : step === 2 ? 'Skills & Resume' : 'Links & Terms'}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step 
                    ? 'w-6 bg-gradient-to-r from-[#FD297B] to-[#FF7854]' 
                    : s < step 
                    ? 'w-2 bg-[#20D5A0]' 
                    : 'w-2 bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: Identity & School */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
            {/* Optional Photo Upload */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-black/40 border border-white/10 flex-shrink-0 flex items-center justify-center">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-slate-500" />
                )}
              </div>

              <div className="flex-1 space-y-1">
                <span className="text-xs font-bold text-white block">Profile Picture (Optional)</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
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
                    placeholder="Or paste photo URL..."
                    value={avatarUrl.startsWith('data:') ? '' : avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FD297B]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 mb-1 block">Full Name *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Alex Chen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FD297B]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 mb-1 block">Handle / Username *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. @alexcode"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 font-mono focus:outline-none focus:border-[#FD297B]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 mb-1.5 block">Primary Discipline *</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {availableRoles.map((role, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPrimaryRole(role as any)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition-all border text-center ${
                      primaryRole === role 
                        ? 'bg-[#FD297B]/20 border-[#FD297B] text-pink-200 shadow-md' 
                        : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 mb-1 block">University / School *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Stanford University"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FD297B]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 mb-1 block">Major *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Computer Science"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FD297B]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!name.trim() || !university.trim()}
                className="px-6 py-3 rounded-full tinder-gradient disabled:opacity-40 text-white text-xs font-bold shadow-lg shadow-[#FD297B]/25 flex items-center gap-2 active:scale-95 transition-all"
              >
                <span>Continue to Skills</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Resume Parser & Skills */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
            {/* Drag & Drop Resume Upload Box */}
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleResumeDrop}
              onClick={() => resumeInputRef.current?.click()}
              className="p-4 rounded-2xl border-2 border-dashed border-white/20 hover:border-[#20D5A0] bg-white/5 hover:bg-[#20D5A0]/5 transition-all cursor-pointer text-center space-y-2 group"
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

              <div className="w-10 h-10 mx-auto rounded-xl bg-white/10 group-hover:bg-[#20D5A0]/20 group-hover:text-[#20D5A0] text-slate-300 flex items-center justify-center transition-colors">
                <FileText className="w-5 h-5" />
              </div>

              <div>
                <p className="text-xs font-bold text-white">
                  {resumeFileName ? `Attached: ${resumeFileName}` : 'Drop Resume (PDF / DOCX) for Instant Skill Auto-Fill ⚡'}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {isParsingResume ? 'Scanning resume keywords...' : 'Auto-extracts languages, frameworks & project stacks'}
                </p>
              </div>

              {resumeParseNotice && (
                <div className="p-2 rounded-xl bg-[#20D5A0]/15 border border-[#20D5A0]/30 text-emerald-300 text-[11px] font-semibold flex items-center justify-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>{resumeParseNotice}</span>
                </div>
              )}
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 mb-1.5 block">What are you looking for?</label>
              <div className="flex flex-wrap gap-1.5">
                {availableIntents.map((intent, idx) => {
                  const isSelected = selectedIntents.includes(intent);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleIntent(intent)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                        isSelected 
                          ? 'bg-[#2DB1FF]/20 border-[#2DB1FF] text-blue-200 shadow-sm' 
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

            <div>
              <label className="text-[11px] font-bold text-slate-300 mb-1.5 block">Your Technologies & Stacks</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {popularSkills.map((sk, idx) => {
                  const isSelected = selectedSkills.includes(sk);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleSkill(sk)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all border ${
                        isSelected 
                          ? 'bg-[#20D5A0]/20 border-[#20D5A0] text-emerald-300' 
                          : 'bg-white/5 border-white/10 text-slate-400'
                      }`}
                    >
                      {sk}
                    </button>
                  );
                })}
              </div>

              {/* Custom Skill Adder */}
              <div className="flex items-center gap-2">
                <input 
                  type="text"
                  placeholder="Add skill (e.g. Zig, ROS2, Solidity)..."
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomSkill(); }}}
                  className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 font-mono focus:outline-none focus:border-[#20D5A0]"
                />
                <button
                  type="button"
                  onClick={addCustomSkill}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"
                  title="Add skill"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 mb-1 block">Short Elevator Pitch / Tagline</label>
              <input 
                type="text"
                placeholder="e.g. Building Next.js agent UIs. Looking for an ML hacker for TreeHacks!"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FD297B]"
              />
            </div>

            <div className="flex items-center justify-between pt-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-bold flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-3 rounded-full tinder-gradient text-white text-xs font-bold shadow-lg shadow-[#FD297B]/25 flex items-center gap-2 active:scale-95 transition-all"
              >
                <span>Continue to Verification</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Public Signals & Terms */}
        {step === 3 && (
          <form onSubmit={handleFinish} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
            <div className="space-y-3">
              {/* GitHub Handle */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                    <GithubIcon className="w-3.5 h-3.5 text-white" />
                    GitHub Username *
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoEnrich}
                    disabled={!githubUser.trim() || isEnriching}
                    className="text-[10px] font-bold text-[#2DB1FF] hover:underline flex items-center gap-1 disabled:opacity-40"
                  >
                    {isEnriching ? 'Scanning...' : 'Auto-Pull Profile'}
                  </button>
                </div>
                <input 
                  type="text"
                  required
                  placeholder="e.g. alexchen-dev"
                  value={githubUser}
                  onChange={(e) => setGithubUser(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 font-mono focus:outline-none focus:border-[#FD297B]"
                />
              </div>

              {/* LinkedIn & Portfolio */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                    <LinkedinIcon className="w-3.5 h-3.5 text-blue-400" />
                    LinkedIn (Optional)
                  </label>
                  <input 
                    type="text"
                    placeholder="linkedin.com/in/username"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 font-mono focus:outline-none focus:border-[#FD297B]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-purple-400" />
                    Portfolio (Optional)
                  </label>
                  <input 
                    type="text"
                    placeholder="https://yourportfolio.dev"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 font-mono focus:outline-none focus:border-[#FD297B]"
                  />
                </div>
              </div>

              {/* Custom Showcase Links */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#20D5A0]" />
                    Featured Project Links
                  </label>
                  <span className="text-[10px] text-slate-400">Devpost, LeetCode, Substack, etc.</span>
                </div>

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-1">
                  {['Devpost', 'LeetCode', 'X / Twitter', 'Substack', 'Kaggle', 'Discord'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setNewLinkLabel(preset)}
                      className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/15 text-[10px] text-slate-300 border border-white/10 transition-colors"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>

                {/* Input row */}
                <div className="flex items-center gap-2">
                  <input 
                    type="text"
                    placeholder="Label (e.g. Devpost)"
                    value={newLinkLabel}
                    onChange={(e) => setNewLinkLabel(e.target.value)}
                    className="w-1/3 px-2.5 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#20D5A0]"
                  />
                  <input 
                    type="text"
                    placeholder="URL (https://...)"
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomLink(); }}}
                    className="flex-1 px-2.5 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-slate-500 font-mono focus:outline-none focus:border-[#20D5A0]"
                  />
                  <button
                    type="button"
                    onClick={addCustomLink}
                    disabled={!newLinkLabel.trim() || !newLinkUrl.trim()}
                    className="p-1.5 rounded-xl bg-[#20D5A0]/20 hover:bg-[#20D5A0]/30 text-[#20D5A0] border border-[#20D5A0]/40 disabled:opacity-40"
                    title="Add Link"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {customLinks.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {customLinks.map((link, idx) => (
                      <div 
                        key={idx}
                        className="px-2.5 py-1 rounded-xl bg-white/10 border border-white/15 text-xs text-slate-200 flex items-center gap-1.5 shadow-sm"
                      >
                        <span className="font-semibold text-white">{link.label}:</span>
                        <span className="text-[11px] text-slate-400 truncate max-w-[120px] font-mono">{link.url}</span>
                        <button
                          type="button"
                          onClick={() => removeCustomLink(idx)}
                          className="p-0.5 hover:text-red-400 text-slate-400 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Clean Professional Terms Disclosure Box */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-white font-bold">
                <ShieldCheck className="w-4 h-4 text-[#FD297B]" />
                <span>Terms & Public Profile Visibility Agreement</span>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed bg-black/40 p-2.5 rounded-xl border border-white/5">
                By creating a profile, you agree that your name, university, skills, bio, public GitHub stats, and LinkedIn headline will be visible to verified students on Connector for matchmaking and hackathon squad formation.
              </p>

              <div className="flex items-start gap-2.5 pt-1">
                <input 
                  type="checkbox"
                  id="terms-check"
                  required
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 accent-[#FD297B] rounded cursor-pointer flex-shrink-0"
                />
                <label htmlFor="terms-check" className="text-[11px] text-slate-300 cursor-pointer">
                  I agree to the{' '}
                  <button 
                    type="button" 
                    onClick={onViewTerms}
                    className="text-[#FD297B] underline font-bold"
                  >
                    Terms of Service
                  </button>{' '}
                  and public student profile visibility for developer matching.
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-bold flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              <button
                type="submit"
                disabled={!agreedToTerms || !githubUser.trim()}
                className="px-6 py-3 rounded-full tinder-gradient disabled:opacity-40 text-white text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-[#FD297B]/30 flex items-center gap-2 active:scale-95 transition-all"
              >
                <Sparkles className="w-4 h-4 fill-white" />
                <span>Create My Dev Card & Start Swiping</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
