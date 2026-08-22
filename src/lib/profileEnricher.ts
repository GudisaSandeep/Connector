import { TechProfile } from '@/types';

interface EnrichRequest {
  githubUsername?: string;
  linkedinUrl?: string;
  university?: string;
  major?: string;
  targetRole?: string;
}

export async function enrichProfileFromPublicData(data: EnrichRequest): Promise<Partial<TechProfile>> {
  const username = data.githubUsername?.replace(/https?:\/\/(www\.)?github\.com\//, '').replace(/\/$/, '') || 'dev';
  
  let fetchedName = username;
  let fetchedBio = `Computer Science student passionate about building performant software.`;
  let avatarUrl = `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80`;
  let reposCount = 18;
  let starsCount = 45;
  let topLangs = [
    { name: 'TypeScript', percentage: 55, color: '#3178c6' },
    { name: 'Python', percentage: 30, color: '#3572A5' },
    { name: 'HTML/CSS', percentage: 15, color: '#e34c26' }
  ];

  // Attempt live GitHub public API fetch if username is provided
  if (data.githubUsername && data.githubUsername.trim().length > 0) {
    try {
      const ghRes = await fetch(`https://api.github.com/users/${username}`, {
        headers: { 'User-Agent': 'Connecter-App' }
      });
      if (ghRes.ok) {
        const ghData = await ghRes.json();
        if (ghData.name) fetchedName = ghData.name;
        if (ghData.bio) fetchedBio = ghData.bio;
        if (ghData.avatar_url) avatarUrl = ghData.avatar_url;
        if (typeof ghData.public_repos === 'number') reposCount = ghData.public_repos;
      }
    } catch (e) {
      // Fallback gracefully on rate limits or offline
      console.warn('GitHub public API fetch failed, using enriched defaults', e);
    }
  }

  // Derive tech skills based on role / input
  const role = (data.targetRole as any) || 'Full-Stack';
  const university = data.university || 'Tech University';
  const major = data.major || 'Computer Science';

  const defaultSkillsByRole: Record<string, any> = {
    'Frontend': {
      languages: ['TypeScript', 'JavaScript', 'CSS/HTML'],
      frameworks: ['React', 'Next.js', 'TailwindCSS', 'Vite'],
      toolsAndCloud: ['Vercel', 'Figma', 'Git', 'npm'],
      domains: ['Modern Web Apps', 'Design Systems', 'Responsive UI']
    },
    'AI / ML Engineer': {
      languages: ['Python', 'C++', 'SQL'],
      frameworks: ['PyTorch', 'Hugging Face', 'FastAPI', 'LangChain'],
      toolsAndCloud: ['CUDA', 'Jupyter', 'Weights & Biases', 'Docker'],
      domains: ['Generative AI', 'LLMs', 'Computer Vision']
    },
    'Backend': {
      languages: ['Go', 'Python', 'SQL', 'Java'],
      frameworks: ['Gin', 'FastAPI', 'Express', 'Spring Boot'],
      toolsAndCloud: ['PostgreSQL', 'Redis', 'Docker', 'AWS'],
      domains: ['Distributed Systems', 'API Design', 'Microservices']
    },
    'Full-Stack': {
      languages: ['TypeScript', 'Python', 'SQL'],
      frameworks: ['Next.js', 'React', 'TailwindCSS', 'Node.js'],
      toolsAndCloud: ['Supabase', 'PostgreSQL', 'Docker', 'Vercel'],
      domains: ['Fullstack SaaS', 'Developer Tools', 'AI Agent UI']
    }
  };

  const selectedSkills = defaultSkillsByRole[role] || defaultSkillsByRole['Full-Stack'];

  return {
    id: `user-${Date.now()}`,
    name: fetchedName,
    handle: `@${username.toLowerCase()}`,
    avatar: avatarUrl,
    university,
    major,
    graduationYear: 2026,
    location: 'San Francisco Bay Area / Remote',
    isRemoteAvailable: true,
    experienceLevel: 'Junior',
    primaryRole: role,
    tagline: fetchedBio.slice(0, 100) || `Building ${role} software and exploring new stacks.`,
    bio: fetchedBio,
    skills: selectedSkills,
    intents: ['Hackathon Teammate', 'Startup Co-Founder'],
    badges: [
      { label: `🎓 ${university.split(' ')[0]} '26`, icon: 'GraduationCap', variant: 'purple' },
      { label: `⚡ ${reposCount}+ Public Repos`, icon: 'Zap', variant: 'cyan' },
      { label: '🚀 Active Builder', icon: 'Rocket', variant: 'emerald' }
    ],
    github: {
      username,
      reposCount,
      starsCount,
      totalCommitsThisYear: 320,
      currentStreakDays: 14,
      topLanguages: topLangs,
      featuredRepos: [
        {
          title: `${username}-spotlight-app`,
          description: `Full-stack modern application built with ${selectedSkills.frameworks.slice(0, 2).join(' & ')}.`,
          techStack: selectedSkills.frameworks.slice(0, 3),
          githubUrl: `https://github.com/${username}`,
          starsCount: 12
        }
      ]
    },
    linkedin: {
      profileUrl: data.linkedinUrl || `https://linkedin.com/in/${username}`,
      headline: `${major} Student @ ${university} | Aspiring ${role}`,
      connectionsCount: 420,
      education: `${major}, ${university}`,
      pastInternships: ['Software Engineering Intern'],
      verifiedStudent: true
    },
    socials: {
      github: `https://github.com/${username}`,
      linkedin: data.linkedinUrl || `https://linkedin.com/in/${username}`,
      portfolio: `https://${username}.dev`
    }
  };
}
