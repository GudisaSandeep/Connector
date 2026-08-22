'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { TechProfile, MatchResult, ChatMessage, FilterPreferences } from '@/types';
import { CURRENT_USER, PROFILES_DECK, INITIAL_MATCHES, INITIAL_CHAT_MESSAGES } from '@/lib/mockData';
import { calculateSynergy } from '@/lib/matchingEngine';
import { 
  supabase, 
  registerStudentProfile, 
  fetchActiveProfiles, 
  recordUserSwipe, 
  recordMatch, 
  sendChatMessageToSupabase 
} from '@/lib/supabaseClient';
import { Navbar } from '@/components/Navbar';
import { SwipeDeck } from '@/components/SwipeDeck';
import { ChatView } from '@/components/ChatView';
import { MatchCelebrationModal } from '@/components/MatchCelebrationModal';
import { FilterModal } from '@/components/FilterModal';
import { MyProfileModal } from '@/components/MyProfileModal';
import { OnboardingModal } from '@/components/OnboardingModal';
import { TermsModal } from '@/components/TermsModal';
import { AiDiscoveryRadar } from '@/components/AiDiscoveryRadar';
import { 
  Flame, 
  Sparkles, 
  X,
  MessageCircle,
  ShieldCheck,
  Code2,
  Database
} from 'lucide-react';

export default function Home() {
  const [currentUser, setCurrentUser] = useState<TechProfile>(CURRENT_USER);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [dbConnected, setDbConnected] = useState(true);

  // Initialize Profiles Deck
  const [profiles, setProfiles] = useState<TechProfile[]>(() => {
    return PROFILES_DECK.map(p => {
      const syn = calculateSynergy(CURRENT_USER, p);
      return {
        ...p,
        synergyScore: syn.score,
        synergyReason: syn.reason,
        complementarySkills: syn.complementarySkills,
        sharedInterests: syn.sharedInterests
      };
    });
  });

  const [swipeHistory, setSwipeHistory] = useState<{ profile: TechProfile; direction: string }[]>([]);
  const [matches, setMatches] = useState<MatchResult[]>(INITIAL_MATCHES);
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_CHAT_MESSAGES);
  const [activeMatchId, setActiveMatchId] = useState<string | null>('user-1');

  // Modals & Drawers
  const [matchedCelebrationProfile, setMatchedCelebrationProfile] = useState<TechProfile | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isMyProfileModalOpen, setIsMyProfileModalOpen] = useState(false);
  const [isMatchesModalOpen, setIsMatchesModalOpen] = useState(false);
  const [isRadarOpen, setIsRadarOpen] = useState(false);

  // Filters
  const [filters, setFilters] = useState<FilterPreferences>({
    intents: [],
    roles: [],
    techStack: [],
    experienceLevels: [],
    remoteOnly: false,
    minSynergyScore: 60,
    locationQuery: ''
  });

  // Load Real Profiles from database on mount
  const loadRealProfiles = useCallback(async (activeUser: TechProfile) => {
    try {
      const realFromDb = await fetchActiveProfiles();
      if (realFromDb && realFromDb.length > 0) {
        const scored = realFromDb.map(p => {
          const syn = calculateSynergy(activeUser, p);
          return {
            ...p,
            synergyScore: syn.score,
            synergyReason: syn.reason,
            complementarySkills: syn.complementarySkills,
            sharedInterests: syn.sharedInterests
          };
        });

        setProfiles(scored);
        setDbConnected(true);
      }
    } catch (e) {
      console.warn('Could not load real profiles from database:', e);
    }
  }, []);

  // Automatic Background Webcmd Scout for the Feed (20+ candidates minimum)
  const autoScoutNearbyFeedProfiles = useCallback(async (activeUser: TechProfile, targetLocation?: string) => {
    try {
      const loc = targetLocation || activeUser.location || activeUser.university || 'San Francisco';
      const cleanLoc = loc.trim();
      const cleanWords = cleanLoc.split(/[\s,]+/).filter(w => w.length > 2);
      const mainCity = cleanWords[0] || 'San Francisco';
      const targetSkill = ['Frontend', 'UI/UX & Product'].includes(activeUser.primaryRole) ? 'Python' : 'TypeScript';

      let candidates: TechProfile[] = [];

      // 1. Try Backend Agent first
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
      try {
        const res = await fetch(`${backendUrl}/api/agent/discover`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userProfile: activeUser,
            locationQuery: cleanLoc,
            radiusMiles: 30,
            maxCandidates: 25
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.discoveredCandidates && data.discoveredCandidates.length > 0) {
            candidates = data.discoveredCandidates.map((d: any) => d.profile);
          }
        }
      } catch (e) {
        // Backend offline fallback to client-side real search
      }

      // 2. Client-side Real Live Search Fallback (Multi-track 20+ profiles)
      if (candidates.length < 10) {
        const languages = [targetSkill, 'TypeScript', 'Python', 'Rust', 'Go', 'JavaScript'];
        const queries = [
          `location:"${cleanLoc}" type:user repos:>1`,
          `"${cleanLoc}" in:bio,company type:user repos:>1`,
          `location:"${mainCity}" type:user repos:>2`,
          ...languages.map(l => `location:"${mainCity}" language:${l} type:user repos:>1`)
        ];

        const handles = new Set<string>();
        for (const q of queries) {
          if (handles.size >= 24) break;
          try {
            const searchRes = await fetch(
              `https://api.github.com/search/users?q=${encodeURIComponent(q)}&sort=repositories&per_page=30`,
              { headers: { 'Accept': 'application/vnd.github.v3+json' } }
            );
            if (searchRes.ok) {
              const sData = await searchRes.json();
              if (sData.items && Array.isArray(sData.items)) {
                sData.items.forEach((item: any) => {
                  if (item.login) handles.add(item.login);
                });
              }
            }
          } catch (e) {}
        }

        const handleList = Array.from(handles).slice(0, 22);
        const batchSize = 6;
        for (let i = 0; i < handleList.length; i += batchSize) {
          const batch = handleList.slice(i, i + batchSize);
          const batchResults = await Promise.all(
            batch.map(async (h) => {
              try {
                const uRes = await fetch(`https://api.github.com/users/${h}`);
                if (!uRes.ok) return null;
                const uData = await uRes.json();
                const reposRes = await fetch(`https://api.github.com/users/${h}/repos?sort=updated&per_page=6`);
                const rData = reposRes.ok ? await reposRes.json() : [];
                const stars = rData.reduce((acc: number, r: any) => acc + (r.stargazers_count || 0), 0);
                const topLang = rData[0]?.language || targetSkill;

                let role: any = 'Full-Stack';
                if (['Python', 'Jupyter Notebook', 'CUDA'].includes(topLang)) role = 'AI / ML Engineer';
                else if (['Rust', 'C', 'Go'].includes(topLang)) role = 'Systems / DevOps';
                else if (['TypeScript', 'JavaScript', 'HTML'].includes(topLang)) role = 'Frontend';

                const blog = uData.blog || '';
                const twitter = uData.twitter_username;
                const email = uData.email;

                const cProfile: TechProfile = {
                  id: `real-gh-${h}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                  name: uData.name || h,
                  handle: `@${h}`,
                  avatar: uData.avatar_url,
                  university: uData.company || `${cleanLoc} University`,
                  major: 'Computer Science & Software',
                  graduationYear: 2026,
                  location: uData.location || cleanLoc,
                  isRemoteAvailable: true,
                  experienceLevel: stars > 50 ? 'Senior' : 'Junior',
                  primaryRole: role,
                  tagline: uData.bio?.slice(0, 110) || `Active ${topLang} builder on GitHub.`,
                  bio: `${uData.bio || 'Software engineer and open source contributor'}.`,
                  skills: {
                    languages: [topLang, 'TypeScript', 'Python'],
                    frameworks: ['React', 'Next.js', 'TailwindCSS'],
                    toolsAndCloud: ['Git', 'Docker'],
                    domains: [role, 'Software Engineering']
                  },
                  intents: ['Hackathon Teammate', 'Startup Co-Founder'],
                  badges: [
                    { label: `📍 ${cleanLoc.split(',')[0]}`, icon: 'MapPin', variant: 'cyan' },
                    { label: `⭐ ${stars} Stars`, icon: 'Star', variant: 'gold' },
                    { label: '🚀 Verified GitHub', icon: 'CheckCircle2', variant: 'emerald' }
                  ],
                  github: {
                    username: h,
                    avatarUrl: uData.avatar_url,
                    reposCount: uData.public_repos || rData.length,
                    starsCount: stars,
                    totalCommitsThisYear: 420,
                    currentStreakDays: 18,
                    topLanguages: [{ name: topLang, percentage: 80, color: '#3178c6' }],
                    featuredRepos: rData.slice(0, 2).map((r: any) => ({
                      title: r.name,
                      description: r.description || 'Public open source project.',
                      techStack: [r.language || 'TypeScript'],
                      githubUrl: r.html_url,
                      starsCount: r.stargazers_count || 0
                    }))
                  },
                  linkedin: {
                    profileUrl: blog?.includes('linkedin.com') ? blog : `https://linkedin.com/in/${h}`,
                    headline: `Software Engineer @ ${uData.company || 'Tech'}`,
                    connectionsCount: 450,
                    education: 'Computer Science',
                    pastInternships: ['Software Engineer'],
                    verifiedStudent: true
                  },
                  socials: {
                    github: `https://github.com/${h}`,
                    linkedin: blog?.includes('linkedin.com') ? blog : `https://linkedin.com/in/${h}`,
                    portfolio: blog ? (blog.startsWith('http') ? blog : `https://${blog}`) : `https://${h}.dev`
                  },
                  customLinks: [
                    ...(blog ? [{ label: 'Portfolio / Blog', url: blog }] : []),
                    ...(twitter ? [{ label: 'X / Twitter', url: `https://x.com/${twitter}` }] : []),
                    ...(email ? [{ label: 'Direct Email', url: `mailto:${email}` }] : [])
                  ]
                };

                const syn = calculateSynergy(activeUser, cProfile);
                cProfile.synergyScore = syn.score;
                cProfile.synergyReason = syn.reason;
                cProfile.complementarySkills = syn.complementarySkills;
                cProfile.sharedInterests = syn.sharedInterests;

                return cProfile;
              } catch (e) {
                return null;
              }
            })
          );

          for (const item of batchResults) {
            if (item) candidates.push(item);
          }
        }
      }

      if (candidates.length > 0) {
        setProfiles(prev => {
          if (targetLocation) {
            const newIds = new Set(candidates.map(c => c.id));
            const remaining = prev.filter(p => !newIds.has(p.id));
            return [...candidates, ...remaining];
          }
          const existingIds = new Set(prev.map(p => p.id));
          const toAdd = candidates.filter(c => !existingIds.has(c.id));
          return [...toAdd, ...prev];
        });

        // Persist discovered profiles to Supabase
        for (const c of candidates) {
          registerStudentProfile(c).catch(() => {});
        }
      }
    } catch (err) {
      console.warn('Auto scout feed error:', err);
    }
  }, []);

  // Check initial onboarding status & fetch real DB profiles + Auto-scout on load
  useEffect(() => {
    try {
      const hasOnboarded = localStorage.getItem('connector_onboarded');
      const savedProfile = localStorage.getItem('connector_user_profile');

      let active = CURRENT_USER;
      if (!hasOnboarded) {
        setIsOnboardingOpen(true);
      } else if (savedProfile) {
        active = JSON.parse(savedProfile);
        setCurrentUser(active);
      }

      loadRealProfiles(active);
      // Auto-scout nearby builders into feed by default
      autoScoutNearbyFeedProfiles(active);

      // Realtime subscription for newly registered profiles
      const channel = supabase
        .channel('realtime-profiles')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'profiles' }, (payload: any) => {
          if (payload.new && payload.new.id !== active.id) {
            const newRow = payload.new;
            const newProfile: TechProfile = {
              id: newRow.id,
              name: newRow.name,
              handle: newRow.handle,
              avatar: newRow.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
              university: newRow.university,
              major: newRow.major,
              graduationYear: newRow.graduation_year || 2026,
              location: newRow.location || 'San Francisco, CA',
              isRemoteAvailable: newRow.is_remote_available ?? true,
              experienceLevel: newRow.experience_level || 'Junior',
              primaryRole: newRow.primary_role,
              tagline: newRow.tagline || '',
              bio: newRow.bio || '',
              skills: newRow.skills || { languages: [], frameworks: [], toolsAndCloud: [], domains: [] },
              intents: newRow.intents || ['Hackathon Teammate'],
              badges: newRow.badges || [],
              github: newRow.github || { username: 'dev', reposCount: 0, starsCount: 0, totalCommitsThisYear: 0, currentStreakDays: 0, topLanguages: [], featuredRepos: [] },
              linkedin: newRow.linkedin || { profileUrl: '', headline: '', connectionsCount: 0, education: '', pastInternships: [], verifiedStudent: false },
              socials: newRow.socials || {},
              customLinks: newRow.custom_links || []
            };

            const syn = calculateSynergy(active, newProfile);
            setProfiles(prev => [{
              ...newProfile,
              synergyScore: syn.score,
              synergyReason: syn.reason,
              complementarySkills: syn.complementarySkills,
              sharedInterests: syn.sharedInterests
            }, ...prev.filter(p => p.id !== newProfile.id)]);
          }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (e) {
      console.warn('Init error:', e);
    }
  }, [loadRealProfiles, autoScoutNearbyFeedProfiles]);

  const filteredProfiles = useMemo(() => {
    return profiles.filter(p => {
      if (p.synergyScore && p.synergyScore < filters.minSynergyScore) return false;
      if (filters.remoteOnly && !p.isRemoteAvailable) return false;

      if (filters.intents.length > 0) {
        const hasIntent = p.intents.some(i => filters.intents.includes(i));
        if (!hasIntent) return false;
      }

      if (filters.roles.length > 0 && !filters.roles.includes(p.primaryRole)) return false;

      if (filters.techStack.length > 0) {
        const allSkills = [
          ...p.skills.languages,
          ...p.skills.frameworks,
          ...p.skills.toolsAndCloud
        ];
        const hasTech = filters.techStack.some(t => 
          allSkills.some(cs => cs.toLowerCase().includes(t.toLowerCase()))
        );
        if (!hasTech) return false;
      }

      if (filters.locationQuery && filters.locationQuery.trim()) {
        const query = filters.locationQuery.toLowerCase().trim();
        const pLoc = (p.location || '').toLowerCase();
        const pUniv = (p.university || '').toLowerCase();
        const queryWords = query.split(/[\s,]+/).filter(w => w.length > 2);
        const matchesLoc = queryWords.some(w => pLoc.includes(w) || pUniv.includes(w)) ||
          p.badges?.some(b => queryWords.some(w => b.label.toLowerCase().includes(w)));
        if (!matchesLoc) return false;
      }

      return true;
    });
  }, [profiles, filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.intents.length > 0) count += filters.intents.length;
    if (filters.roles.length > 0) count += filters.roles.length;
    if (filters.techStack.length > 0) count += filters.techStack.length;
    if (filters.remoteOnly) count += 1;
    if (filters.minSynergyScore > 60) count += 1;
    if (filters.locationQuery && filters.locationQuery.trim()) count += 1;
    return count;
  }, [filters]);

  // Recalculate synergy when currentUser updates & save to Supabase
  const handleUpdateProfile = async (newProfile: TechProfile) => {
    setCurrentUser(newProfile);
    try {
      localStorage.setItem('connector_user_profile', JSON.stringify(newProfile));
      await registerStudentProfile(newProfile);
    } catch (e) {}

    setProfiles(prev => prev.map(p => {
      const syn = calculateSynergy(newProfile, p);
      return {
        ...p,
        synergyScore: syn.score,
        synergyReason: syn.reason,
        complementarySkills: syn.complementarySkills,
        sharedInterests: syn.sharedInterests
      };
    }));
  };

  const handleOnboardingComplete = async (newProfile: TechProfile) => {
    await handleUpdateProfile(newProfile);
    try {
      localStorage.setItem('connector_onboarded', 'true');
    } catch (e) {}
    setIsOnboardingOpen(false);
    loadRealProfiles(newProfile);
    autoScoutNearbyFeedProfiles(newProfile);
  };

  // Logout Handler
  const handleLogout = () => {
    try {
      localStorage.removeItem('connector_onboarded');
      localStorage.removeItem('connector_user_profile');
    } catch (e) {}

    setIsMyProfileModalOpen(false);
    setIsOnboardingOpen(true);
  };

  // Add Non-registered candidates scouted by Autonomous Webcmd AI Agent
  const handleAddScoutedCandidates = async (newCandidates: TechProfile[]) => {
    if (!newCandidates || newCandidates.length === 0) return;

    // Reset filters that could accidentally hide newly added candidates
    setFilters({
      intents: [],
      roles: [],
      techStack: [],
      experienceLevels: [],
      remoteOnly: false,
      minSynergyScore: 60,
      locationQuery: ''
    });

    // Place all newly discovered candidates right at top of deck
    setProfiles(prev => {
      const newIds = new Set(newCandidates.map(c => c.id));
      const remaining = prev.filter(p => !newIds.has(p.id));
      return [...newCandidates, ...remaining];
    });

    for (const c of newCandidates) {
      try {
        await registerStudentProfile(c);
      } catch (e) {}
    }
  };

  // Apply filters & auto-scout new location if specified
  const handleApplyFilters = (newFilters: FilterPreferences) => {
    setFilters(newFilters);
    if (newFilters.locationQuery && newFilters.locationQuery.trim()) {
      autoScoutNearbyFeedProfiles(currentUser, newFilters.locationQuery.trim());
    }
  };

  // Swipe Action
  const handleSwipe = async (profile: TechProfile, direction: 'left' | 'right' | 'super') => {
    setSwipeHistory(prev => [...prev, { profile, direction }]);
    recordUserSwipe(currentUser.id, profile.id, direction);

    if (direction === 'right' || direction === 'super') {
      const synergyScore = profile.synergyScore || 85;
      const newMatch: MatchResult = {
        id: `match-${Date.now()}`,
        matchedAt: 'Just now',
        userProfile: profile,
        unreadCount: 0,
        intent: profile.intents[0] || 'Hackathon Teammate',
        synergyScore
      };

      setMatches(prev => [newMatch, ...prev]);
      setActiveMatchId(profile.id);
      setMatchedCelebrationProfile(profile);

      recordMatch(currentUser.id, profile.id, synergyScore);
    }
  };

  const handleRewind = () => {
    if (swipeHistory.length === 0) return;
    const last = swipeHistory[swipeHistory.length - 1];
    setSwipeHistory(prev => prev.slice(0, -1));
    setProfiles(prev => [last.profile, ...prev]);
  };

  const handleSendMessage = async (matchId: string, text: string) => {
    if (!text.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      receiverId: matchId,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => ({
      ...prev,
      [matchId]: [...(prev[matchId] || []), newMsg]
    }));

    sendChatMessageToSupabase(currentUser.id, matchId, text.trim());
  };

  const handleStartChatFromModal = (profile: TechProfile, initialMessage?: string) => {
    setActiveMatchId(profile.id);
    setIsMatchesModalOpen(true);
    if (initialMessage) {
      handleSendMessage(profile.id, initialMessage);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0d13] text-foreground flex flex-col justify-between selection:bg-[#FD297B] selection:text-white">
      {/* Tinder Minimal Navbar */}
      <Navbar 
        currentUser={currentUser}
        onOpenProfile={() => setIsMyProfileModalOpen(true)}
        onOpenFilters={() => setIsFilterModalOpen(true)}
        onOpenMatches={() => setIsMatchesModalOpen(true)}
        onOpenRadar={() => setIsRadarOpen(true)}
        onLogout={handleLogout}
        matchesCount={matches.length}
        activeFilterCount={activeFilterCount}
      />

      {/* Main Tinder Card Deck Area */}
      <main className="flex-1 flex flex-col items-center justify-center py-2 px-2 w-full max-w-lg mx-auto">
        <SwipeDeck 
          profiles={filteredProfiles}
          onSwipe={handleSwipe}
          onRewind={handleRewind}
          canRewind={swipeHistory.length > 0}
          onOpenFilters={() => setIsFilterModalOpen(true)}
        />
      </main>

      {/* Minimal Footer with Realtime Network Indicator & Terms */}
      <footer className="py-3 text-center text-[11px] text-slate-500 font-mono select-none border-t border-white/5 bg-[#0b0d13]">
        <div className="flex items-center justify-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Network
          </span>
          <span>•</span>
          <span>Connector • Tinder for Tech Students</span>
          <span>•</span>
          <button
            onClick={() => setIsTermsOpen(true)}
            className="text-slate-400 hover:text-[#FD297B] underline transition-colors"
          >
            Terms & Conditions
          </button>
        </div>
      </footer>

      {/* Onboarding Flow Modal for New Users */}
      <OnboardingModal 
        isOpen={isOnboardingOpen}
        onComplete={handleOnboardingComplete}
        onViewTerms={() => setIsTermsOpen(true)}
      />

      {/* Standalone Terms & Privacy Modal */}
      <TermsModal 
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />

      {/* Match Celebration Modal */}
      <MatchCelebrationModal 
        isOpen={!!matchedCelebrationProfile}
        matchedProfile={matchedCelebrationProfile}
        currentUserAvatar={currentUser?.avatar}
        onClose={() => setMatchedCelebrationProfile(null)}
        onStartChat={handleStartChatFromModal}
      />

      {/* Matches & Chat Modal */}
      {isMatchesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-[#12141c] border border-white/10 shadow-2xl flex flex-col">
            <div className="p-3 px-5 border-b border-white/10 flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-[#FD297B]" />
                <h3 className="font-bold text-white text-sm">Matches & Conversations</h3>
              </div>
              <button 
                onClick={() => setIsMatchesModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden">
              <ChatView 
                matches={matches}
                activeMatchId={activeMatchId}
                onSelectMatch={(id) => setActiveMatchId(id)}
                messages={chatMessages}
                onSendMessage={handleSendMessage}
              />
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      <FilterModal 
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        onApplyFilters={handleApplyFilters}
        onResetFilters={() => setFilters({
          intents: [],
          roles: [],
          techStack: [],
          experienceLevels: [],
          remoteOnly: false,
          minSynergyScore: 60,
          locationQuery: ''
        })}
      />

      {/* My Profile Modal */}
      <MyProfileModal 
        isOpen={isMyProfileModalOpen}
        onClose={() => setIsMyProfileModalOpen(false)}
        currentUser={currentUser}
        onUpdateProfile={handleUpdateProfile}
        onLogout={handleLogout}
      />

      {/* Autonomous Webcmd AI Scout Radar Modal */}
      <AiDiscoveryRadar 
        isOpen={isRadarOpen}
        onClose={() => setIsRadarOpen(false)}
        currentUser={currentUser}
        onAddCandidatesToDeck={handleAddScoutedCandidates}
      />
    </div>
  );
}
