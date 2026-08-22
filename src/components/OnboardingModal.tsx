'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { TechProfile, IntentType, ExperienceLevel } from '@/types';
import { GithubIcon, LinkedinIcon } from './icons';
import { 
  Flame, 
  Sparkles, 
  GraduationCap, 
  Code2, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  FileText, 
  AlertCircle,
  Terminal,
  User,
  Plus,
  X
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

  // Form State
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [university, setUniversity] = useState('');
  const [major, setMajor] = useState('Computer Science');
  const [gradYear, setGradYear] = useState<number>(2026);
  const [location, setLocation] = useState('San Francisco, CA');
  const [isRemoteAvailable, setIsRemoteAvailable] = useState(true);
  const [primaryRole, setPrimaryRole] = useState<'Frontend' | 'Backend' | 'Full-Stack' | 'AI / ML Engineer' | 'Mobile Dev' | 'Systems / DevOps' | 'UI/UX & Product'>('Full-Stack');
  
  // Step 2 State
  const [selectedIntents, setSelectedIntents] = useState<IntentType[]>(['Hackathon Teammate', 'Startup Co-Founder']);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['TypeScript', 'React', 'Next.js', 'Python', 'TailwindCSS']);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [tagline, setTagline] = useState('');
  const [bio, setBio] = useState('');

  // Step 3 State
  const [githubUser, setGithubUser] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
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

  // Quick auto-enrich from GitHub handle
  const handleAutoEnrich = async () => {
    if (!githubUser.trim()) return;
    setIsEnriching(true);
    try {
      const res = await fetch(`https://api.github.com/users/${githubUser.trim().replace('@', '')}`);
      if (res.ok) {
        const data = await res.json();
        if (data.name && !name) setName(data.name);
        if (data.avatar_url) setAvatarUrl(data.avatar_url);
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
      id: `user-me-${Date.now()}`,
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
        portfolio: `https://${cleanGh}.dev`
      }
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
        {/* Glow Element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#FD297B]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Step Indicator */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl tinder-gradient flex items-center justify-center shadow-md shadow-[#FD297B]/25">
              <Flame className="w-4 h-4 text-white fill-white" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-white tracking-tight">
                Welcome to Connector
              </span>
              <p className="text-[11px] text-slate-400">Step {step} of 3 • Set Up Your Dev Card</p>
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
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Who are you?</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Let fellow student developers know your background and what you build.
              </p>
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 mb-1 block">Graduation Year</label>
                <select
                  value={gradYear}
                  onChange={(e) => setGradYear(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-[#FD297B]"
                >
                  <option value={2025} className="bg-slate-900">Class of 2025</option>
                  <option value={2026} className="bg-slate-900">Class of 2026</option>
                  <option value={2027} className="bg-slate-900">Class of 2027</option>
                  <option value={2028} className="bg-slate-900">Class of 2028</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 mb-1 block">Location</label>
                <input 
                  type="text"
                  placeholder="e.g. San Francisco, CA"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#FD297B]"
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

        {/* STEP 2: Skills & Intents */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Your Skills & Match Goals</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Our AI synergy engine uses these to match you with complementary teammates.
              </p>
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
              <label className="text-[11px] font-bold text-slate-300 mb-1.5 block">Top Technologies & Stacks</label>
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

              {/* Custom Skill adder */}
              <div className="flex items-center gap-2">
                <input 
                  type="text"
                  placeholder="Add custom skill (e.g. Zig, ROS2, Solidity)..."
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

        {/* STEP 3: Public Signals & Terms Agreement */}
        {step === 3 && (
          <form onSubmit={handleFinish} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Public Signals & Terms</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Connect your developer footprints for verified badges and review visibility terms.
              </p>
            </div>

            <div className="space-y-3">
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

              <div>
                <label className="text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <LinkedinIcon className="w-3.5 h-3.5 text-blue-400" />
                  LinkedIn Profile URL (Optional)
                </label>
                <input 
                  type="text"
                  placeholder="e.g. https://linkedin.com/in/alexchen"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 font-mono focus:outline-none focus:border-[#FD297B]"
                />
              </div>
            </div>

            {/* Terms and Conditions Disclosure Box */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-white font-bold">
                <ShieldCheck className="w-4 h-4 text-[#FD297B]" />
                <span>Professional Terms & Visibility Agreement</span>
              </div>

              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-[11px] text-slate-300 leading-relaxed max-h-24 overflow-y-auto custom-scrollbar">
                <p>
                  <strong>Public Profile Notice:</strong> By proceeding, you acknowledge that your profile details (name, university, degree, declared tech skills, bio, public GitHub repository stats, and LinkedIn headline) will be visible to other verified students and developers in the discovery deck.
                </p>
                <p className="mt-1">
                  • <strong>Zero Spam Policy:</strong> Contact details and messaging are restricted to mutual connections.
                </p>
                <p className="mt-1">
                  • <strong>Code of Conduct:</strong> You agree to maintain professional communication in hackathon squads and mock interviews.
                </p>
              </div>

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
                  and understand my developer profile will be shown to other students for collaboration matching.
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
