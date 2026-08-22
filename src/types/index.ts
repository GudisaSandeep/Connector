export type IntentType = 
  | 'Hackathon Teammate'
  | 'Startup Co-Founder'
  | 'LeetCode / DSA Partner'
  | 'Open-Source Collaborator'
  | 'Project Peer Review'
  | 'Casual Tech Chat';

export type ExperienceLevel = 
  | 'Freshman'
  | 'Sophomore'
  | 'Junior'
  | 'Senior'
  | 'Master / PhD'
  | 'Self-Taught / Bootcamp';

export interface ProjectShowcase {
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveDemoUrl?: string;
  starsCount?: number;
}

export interface GitHubStats {
  username: string;
  avatarUrl?: string;
  reposCount: number;
  starsCount: number;
  totalCommitsThisYear: number;
  topLanguages: { name: string; percentage: number; color: string }[];
  currentStreakDays: number;
  featuredRepos: ProjectShowcase[];
}

export interface LinkedInStats {
  profileUrl: string;
  headline: string;
  connectionsCount: number;
  education: string;
  pastInternships: string[];
  verifiedStudent: boolean;
}

export interface TechProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  coverImage?: string;
  university: string;
  major: string;
  graduationYear: number;
  location: string;
  isRemoteAvailable: boolean;
  experienceLevel: ExperienceLevel;
  tagline: string;
  bio: string;
  primaryRole: 'Frontend' | 'Backend' | 'Full-Stack' | 'AI / ML Engineer' | 'Mobile Dev' | 'Systems / DevOps' | 'UI/UX & Product' | 'Web3 / Blockchain';
  skills: {
    languages: string[];
    frameworks: string[];
    toolsAndCloud: string[];
    domains: string[];
  };
  intents: IntentType[];
  badges: { label: string; icon: string; variant: 'gold' | 'cyan' | 'purple' | 'emerald' }[];
  github: GitHubStats;
  linkedin: LinkedInStats;
  socials: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
    discord?: string;
    twitter?: string;
  };
  synergyScore?: number;
  synergyReason?: string;
  complementarySkills?: string[];
  sharedInterests?: string[];
}

export interface MatchResult {
  id: string;
  matchedAt: string;
  userProfile: TechProfile;
  lastMessage?: string;
  unreadCount: number;
  intent: IntentType;
  synergyScore: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  isProjectInvite?: {
    projectName: string;
    projectDescription: string;
    roleNeeded: string;
  };
}

export interface FilterPreferences {
  intents: IntentType[];
  roles: string[];
  techStack: string[];
  experienceLevels: ExperienceLevel[];
  remoteOnly: boolean;
  minSynergyScore: number;
}

export interface SquadMemberSlot {
  role: string;
  requiredSkills: string[];
  assignedMember?: TechProfile;
}

export interface HackathonSquad {
  id: string;
  name: string;
  hackathonName: string;
  targetDate: string;
  description: string;
  slots: SquadMemberSlot[];
}
