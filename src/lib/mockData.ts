import { TechProfile, IntentType } from '@/types';

export const CURRENT_USER: TechProfile = {
  id: 'user-me',
  name: 'Alex Chen',
  handle: '@alexcode',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
  university: 'Stanford University',
  major: 'Computer Science & AI',
  graduationYear: 2026,
  location: 'Palo Alto, CA',
  isRemoteAvailable: true,
  experienceLevel: 'Junior',
  primaryRole: 'Full-Stack',
  tagline: 'Building next-gen AI interfaces & devtools. Seeking an ML hacker for HackMIT & TreeHacks.',
  bio: 'Junior at Stanford studying CS. Built 4 production Next.js apps with 15k+ MAU. Loves rapid prototyping, clean UI, and edge computing. Looking for an ML engineer or Rust backend builder to team up for upcoming hackathons and maybe a pre-seed startup.',
  skills: {
    languages: ['TypeScript', 'Python', 'Go', 'SQL', 'Rust (learning)'],
    frameworks: ['Next.js', 'React', 'TailwindCSS', 'Node.js', 'FastAPI'],
    toolsAndCloud: ['Supabase', 'PostgreSQL', 'Docker', 'Vercel', 'AWS Lambda'],
    domains: ['Fullstack SaaS', 'AI Agent UI', 'Developer Tools', 'Human-Computer Interaction']
  },
  intents: ['Hackathon Teammate', 'Startup Co-Founder', 'Open-Source Collaborator'],
  badges: [
    { label: '🏆 TreeHacks Winner', icon: 'Trophy', variant: 'gold' },
    { label: '⭐ 1.2k GitHub Stars', icon: 'Star', variant: 'cyan' },
    { label: '🎓 Stanford \'26', icon: 'GraduationCap', variant: 'purple' },
    { label: '🚀 4 Apps Shipped', icon: 'Rocket', variant: 'emerald' }
  ],
  github: {
    username: 'alexchen-dev',
    reposCount: 38,
    starsCount: 1240,
    totalCommitsThisYear: 842,
    currentStreakDays: 46,
    topLanguages: [
      { name: 'TypeScript', percentage: 62, color: '#3178c6' },
      { name: 'Python', percentage: 24, color: '#3572A5' },
      { name: 'Go', percentage: 14, color: '#00ADD8' }
    ],
    featuredRepos: [
      {
        title: 'canvas-ai-workspace',
        description: 'Infinite collaborative canvas for LLM prompt engineering and visual agents.',
        techStack: ['Next.js', 'TypeScript', 'Tailwind', 'tRPC'],
        githubUrl: 'https://github.com/alexchen-dev/canvas-ai',
        starsCount: 890
      },
      {
        title: 'fast-embed-cache',
        description: 'Low-latency in-memory vector cache for high-throughput semantic search.',
        techStack: ['Go', 'Redis', 'Docker'],
        githubUrl: 'https://github.com/alexchen-dev/fast-embed',
        starsCount: 350
      }
    ]
  },
  linkedin: {
    profileUrl: 'https://linkedin.com/in/alexchen-dev',
    headline: 'Software Engineering Intern @ Stripe (Incoming) | CS @ Stanford',
    connectionsCount: 850,
    education: 'B.S. Computer Science, Stanford University',
    pastInternships: ['SWE Intern @ Scale AI', 'Undergrad Researcher @ Stanford HAI'],
    verifiedStudent: true
  },
  socials: {
    github: 'https://github.com/alexchen-dev',
    linkedin: 'https://linkedin.com/in/alexchen-dev',
    portfolio: 'https://alexchen.dev',
    discord: 'alex_chen#0001',
    twitter: 'https://x.com/alexchen_dev'
  },
  customLinks: [
    { label: 'Devpost', url: 'https://devpost.com/alexchen' },
    { label: 'Substack', url: 'https://alexchen.substack.com' }
  ]
};

export const PROFILES_DECK: TechProfile[] = [
  {
    id: 'user-1',
    name: 'Sophia Zhang',
    handle: '@sophia_ai',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80',
    university: 'UC Berkeley',
    major: 'EECS & Machine Learning',
    graduationYear: 2025,
    location: 'Berkeley, CA',
    isRemoteAvailable: true,
    experienceLevel: 'Senior',
    primaryRole: 'AI / ML Engineer',
    tagline: 'Fine-tuning multimodal models & agentic workflows. Looking for a Frontend wizard for HackMIT!',
    bio: 'Senior at UC Berkeley. Conducted research in diffusion models & RLHF at BAIR. Published at NeurIPS workshop. I can build, quantize, and deploy state-of-the-art LLMs, but I need an aesthetic frontend engineer to bring collaborative products to life.',
    skills: {
      languages: ['Python', 'C++', 'CUDA', 'TypeScript', 'Julia'],
      frameworks: ['PyTorch', 'Hugging Face', 'LangGraph', 'vLLM', 'FastAPI'],
      toolsAndCloud: ['NVIDIA TensorRT', 'Weights & Biases', 'Ray', 'GCP Vertex AI'],
      domains: ['Generative AI', 'Multimodal Agents', 'Model Quantization', 'Autonomous Systems']
    },
    intents: ['Hackathon Teammate', 'Startup Co-Founder', 'Open-Source Collaborator'],
    badges: [
      { label: '🏆 NeurIPS Workshop', icon: 'Award', variant: 'gold' },
      { label: '⚡ PyTorch Contributor', icon: 'Zap', variant: 'cyan' },
      { label: '🎓 UC Berkeley \'25', icon: 'GraduationCap', variant: 'purple' },
      { label: '🔥 890 GitHub Stars', icon: 'Star', variant: 'emerald' }
    ],
    github: {
      username: 'sophiaz-ml',
      reposCount: 29,
      starsCount: 890,
      totalCommitsThisYear: 1120,
      currentStreakDays: 78,
      topLanguages: [
        { name: 'Python', percentage: 78, color: '#3572A5' },
        { name: 'C++', percentage: 14, color: '#f34b7d' },
        { name: 'CUDA', percentage: 8, color: '#3A4E58' }
      ],
      featuredRepos: [
        {
          title: 'nano-reasoner',
          description: 'Lightweight reasoning distillation framework for small language models on Apple Silicon.',
          techStack: ['PyTorch', 'MLX', 'Python'],
          githubUrl: 'https://github.com/sophiaz-ml/nano-reasoner',
          starsCount: 620
        },
        {
          title: 'agentic-memory-v2',
          description: 'Hierarchical episodic memory architecture for autonomous tool-calling agents.',
          techStack: ['FastAPI', 'LangChain', 'Qdrant'],
          githubUrl: 'https://github.com/sophiaz-ml/agentic-memory',
          starsCount: 270
        }
      ]
    },
    linkedin: {
      profileUrl: 'https://linkedin.com/in/sophiazhang-ml',
      headline: 'Incoming AI Research Resident @ DeepMind | EECS @ UC Berkeley',
      connectionsCount: 920,
      education: 'B.S. EECS, UC Berkeley',
      pastInternships: ['AI Research Intern @ OpenAI', 'ML Intern @ Meta GenAI'],
      verifiedStudent: true
    },
    socials: {
      github: 'https://github.com/sophiaz-ml',
      linkedin: 'https://linkedin.com/in/sophiazhang-ml',
      portfolio: 'https://sophiazhang.ai',
      twitter: 'https://x.com/sophia_ai_dev'
    },
    customLinks: [
      { label: 'Hugging Face', url: 'https://huggingface.co/sophiaz' },
      { label: 'Kaggle Grandmaster', url: 'https://kaggle.com/sophiaz' }
    ],
    synergyScore: 96,
    synergyReason: '🔥 Insane Complementary Match! She excels in PyTorch & model fine-tuning while you specialize in Next.js & Fullstack UI.',
    complementarySkills: ['PyTorch & CUDA', 'Agentic Memory', 'Model Quantization'],
    sharedInterests: ['AI Agent UI', 'HackMIT 2026', 'Developer Tools']
  },
  {
    id: 'user-2',
    name: 'Marcus Vance',
    handle: '@marcus_systems',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    university: 'MIT',
    major: 'Computer Science & Systems',
    graduationYear: 2026,
    location: 'Cambridge, MA',
    isRemoteAvailable: true,
    experienceLevel: 'Junior',
    primaryRole: 'Systems / DevOps',
    tagline: 'Obsessed with high-throughput distributed systems, Rust, and eBPF kernel tracing.',
    bio: 'MIT CS Junior. I spend my weekends optimizing network protocol latencies and building lock-free data structures. Seeking a frontend partner to build a visual telemetry & distributed debugger tool.',
    skills: {
      languages: ['Rust', 'C', 'Go', 'Zig', 'Python'],
      frameworks: ['Tokio', 'Axum', 'gRPC', 'eBPF', 'Actix'],
      toolsAndCloud: ['Kubernetes', 'Linux Kernel', 'Prometheus', 'Grafana', 'Kafka'],
      domains: ['Distributed Systems', 'Low Latency Networks', 'Observability', 'Database Internals']
    },
    intents: ['Startup Co-Founder', 'Hackathon Teammate', 'Open-Source Collaborator'],
    badges: [
      { label: '⚡ Rust Core Contributor', icon: 'Zap', variant: 'cyan' },
      { label: '🏆 MIT Hack 1st Place', icon: 'Award', variant: 'gold' },
      { label: '🎓 MIT \'26', icon: 'GraduationCap', variant: 'purple' }
    ],
    github: {
      username: 'marcus-sys',
      reposCount: 42,
      starsCount: 1650,
      totalCommitsThisYear: 980,
      currentStreakDays: 62,
      topLanguages: [
        { name: 'Rust', percentage: 70, color: '#dea584' },
        { name: 'C', percentage: 20, color: '#555555' },
        { name: 'Go', percentage: 10, color: '#00ADD8' }
      ],
      featuredRepos: [
        {
          title: 'turbo-raft-rs',
          description: 'Sub-millisecond Raft consensus implementation in asynchronous Rust.',
          techStack: ['Rust', 'Tokio', 'gRPC'],
          githubUrl: 'https://github.com/marcus-sys/turbo-raft',
          starsCount: 1200
        }
      ]
    },
    linkedin: {
      profileUrl: 'https://linkedin.com/in/marcus-vance-sys',
      headline: 'Systems Engineering Intern @ Cloudflare | CS @ MIT',
      connectionsCount: 780,
      education: 'B.S. CS, MIT',
      pastInternships: ['Infrastructure Intern @ Cloudflare', 'Kernel Intern @ Red Hat'],
      verifiedStudent: true
    },
    socials: {
      github: 'https://github.com/marcus-sys',
      linkedin: 'https://linkedin.com/in/marcus-vance-sys',
      portfolio: 'https://marcusvance.tech'
    },
    synergyScore: 91,
    synergyReason: '⚡ High Performance Match! Marcus builds blazingly fast Rust backends that pair seamlessly with your Next.js fullstack capabilities.',
    complementarySkills: ['Rust & Tokio', 'Distributed Consensus', 'eBPF Tracing'],
    sharedInterests: ['Developer Tools', 'High Performance Infrastructure']
  },
  {
    id: 'user-3',
    name: 'Priya Patel',
    handle: '@priya_designcraft',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80',
    university: 'Georgia Tech',
    major: 'Computational Media & HCI',
    graduationYear: 2026,
    location: 'Atlanta, GA',
    isRemoteAvailable: true,
    experienceLevel: 'Junior',
    primaryRole: 'UI/UX & Product',
    tagline: 'Designing award-winning micro-interactions & WebGL 3D web experiences.',
    bio: 'Junior at Georgia Tech combining design theory with front-end shader wizardry (Three.js / GLSL / Framer Motion). Won 3 Awwwards honors. Looking for an ambitious engineer with strong backend/API chops to build viral products.',
    skills: {
      languages: ['TypeScript', 'JavaScript', 'GLSL', 'HTML/CSS', 'Python'],
      frameworks: ['React', 'Three.js', 'Framer Motion', 'TailwindCSS', 'GSAP'],
      toolsAndCloud: ['Figma', 'Blender', 'Spline 3D', 'Vercel', 'Storybook'],
      domains: ['Creative Coding', 'Design Systems', '3D Web Experiences', 'Product Strategy']
    },
    intents: ['Hackathon Teammate', 'Startup Co-Founder', 'Casual Tech Chat'],
    badges: [
      { label: '🎨 3x Awwwards Site of Day', icon: 'Award', variant: 'gold' },
      { label: '⭐ Figma Community Creator', icon: 'Star', variant: 'purple' },
      { label: '🎓 Georgia Tech \'26', icon: 'GraduationCap', variant: 'cyan' }
    ],
    github: {
      username: 'priyadesign',
      reposCount: 22,
      starsCount: 940,
      totalCommitsThisYear: 510,
      currentStreakDays: 34,
      topLanguages: [
        { name: 'TypeScript', percentage: 55, color: '#3178c6' },
        { name: 'GLSL', percentage: 25, color: '#5686a5' },
        { name: 'CSS', percentage: 20, color: '#563d7c' }
      ],
      featuredRepos: [
        {
          title: 'liquid-shaders-react',
          description: 'Curated library of dynamic glassmorphism and liquid WebGL background shaders.',
          techStack: ['Three.js', 'React', 'GLSL'],
          githubUrl: 'https://github.com/priyadesign/liquid-shaders',
          starsCount: 710
        }
      ]
    },
    linkedin: {
      profileUrl: 'https://linkedin.com/in/priyapatel-design',
      headline: 'Product Design Intern @ Linear (Incoming) | HCI @ Georgia Tech',
      connectionsCount: 640,
      education: 'B.S. Computational Media, Georgia Tech',
      pastInternships: ['Design Technologist Intern @ Apple', 'UX Intern @ Figma'],
      verifiedStudent: true
    },
    socials: {
      github: 'https://github.com/priyadesign',
      linkedin: 'https://linkedin.com/in/priyapatel-design',
      portfolio: 'https://priyapatel.design',
      twitter: 'https://x.com/priyacrafts'
    },
    synergyScore: 88,
    synergyReason: '✨ Visual & Polish Match! Priya brings top-tier 3D WebGL craft to elevate your full-stack products to unicorn design quality.',
    complementarySkills: ['Three.js & Shaders', 'Figma Design Systems', 'Motion UX'],
    sharedInterests: ['SaaS Design', 'Hackathon Winning Demos']
  },
  {
    id: 'user-4',
    name: 'David Kim',
    handle: '@david_mobile',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
    university: 'University of Waterloo',
    major: 'Software Engineering',
    graduationYear: 2025,
    location: 'Waterloo, ON / Remote',
    isRemoteAvailable: true,
    experienceLevel: 'Senior',
    primaryRole: 'Mobile Dev',
    tagline: 'Flutter & React Native hacker. Shipped 5 apps to the App Store with 100k+ downloads.',
    bio: 'Waterloo SE Senior. 6 co-ops completed across Silicon Valley & Toronto. Specialized in cross-platform mobile apps, local SQLite caching, offline-first sync, and smooth 120fps animations.',
    skills: {
      languages: ['Dart', 'TypeScript', 'Swift', 'Kotlin', 'Rust'],
      frameworks: ['Flutter', 'React Native', 'Expo', 'SwiftUI', 'TailwindCSS'],
      toolsAndCloud: ['Firebase', 'Supabase', 'RevenueCat', 'App Store Connect', 'Fastlane'],
      domains: ['Mobile UX', 'Offline-First Apps', 'Consumer Tech', 'Fintech']
    },
    intents: ['Startup Co-Founder', 'Hackathon Teammate', 'Project Peer Review'],
    badges: [
      { label: '📱 100k+ App Downloads', icon: 'Rocket', variant: 'emerald' },
      { label: '🏆 Hack the North Winner', icon: 'Award', variant: 'gold' },
      { label: '🎓 Waterloo SE \'25', icon: 'GraduationCap', variant: 'purple' }
    ],
    github: {
      username: 'davidkim-code',
      reposCount: 31,
      starsCount: 680,
      totalCommitsThisYear: 740,
      currentStreakDays: 52,
      topLanguages: [
        { name: 'Dart', percentage: 50, color: '#00B4AB' },
        { name: 'TypeScript', percentage: 35, color: '#3178c6' },
        { name: 'Swift', percentage: 15, color: '#F05138' }
      ],
      featuredRepos: [
        {
          title: 'sync-vault-mobile',
          description: 'End-to-end encrypted note vault with local CRDT synchronization for iOS and Android.',
          techStack: ['Flutter', 'Rust', 'SQLite'],
          githubUrl: 'https://github.com/davidkim-code/sync-vault',
          starsCount: 430
        }
      ]
    },
    linkedin: {
      profileUrl: 'https://linkedin.com/in/davidkim-waterloo',
      headline: 'Former SWE Intern @ Uber, Notion | SE @ Waterloo',
      connectionsCount: 890,
      education: 'B.S. Software Engineering, University of Waterloo',
      pastInternships: ['Mobile SWE Intern @ Notion', 'SWE Intern @ Uber Mobile'],
      verifiedStudent: true
    },
    socials: {
      github: 'https://github.com/davidkim-code',
      linkedin: 'https://linkedin.com/in/davidkim-waterloo'
    },
    synergyScore: 84,
    synergyReason: '📱 Web + Mobile Synergy! You can build the web & backend platform while David brings native iOS/Android capability.',
    complementarySkills: ['Flutter / React Native', 'CRDT Offline Sync', 'App Store Monetization'],
    sharedInterests: ['Startup Ideas', 'Hack the North']
  },
  {
    id: 'user-5',
    name: 'Elena Rostova',
    handle: '@elena_cloud',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
    university: 'Carnegie Mellon University',
    major: 'Information Networking (MSIN)',
    graduationYear: 2025,
    location: 'Pittsburgh, PA',
    isRemoteAvailable: true,
    experienceLevel: 'Master / PhD',
    primaryRole: 'Backend',
    tagline: 'Go, Kubernetes operator architect, and zero-trust backend systems.',
    bio: 'Master student at CMU. Working on container virtualization, auto-scaling architectures, and PostgreSQL query optimizer internals. Passionate about building rock-solid APIs that can scale to millions of requests.',
    skills: {
      languages: ['Go', 'Python', 'C++', 'SQL', 'Bash'],
      frameworks: ['Gin', 'gRPC', 'Temporal', 'Terraform', 'FastAPI'],
      toolsAndCloud: ['AWS', 'Kubernetes', 'PostgreSQL', 'Redis', 'Docker'],
      domains: ['Cloud Architecture', 'Database Optimization', 'Microservices', 'Site Reliability']
    },
    intents: ['Startup Co-Founder', 'LeetCode / DSA Partner', 'Open-Source Collaborator'],
    badges: [
      { label: '☸️ KubeCon Speaker', icon: 'Award', variant: 'cyan' },
      { label: '🎓 CMU MSIN \'25', icon: 'GraduationCap', variant: 'purple' },
      { label: '⚡ Top 5% LeetCode', icon: 'Zap', variant: 'emerald' }
    ],
    github: {
      username: 'elena-cloud',
      reposCount: 35,
      starsCount: 820,
      totalCommitsThisYear: 890,
      currentStreakDays: 41,
      topLanguages: [
        { name: 'Go', percentage: 68, color: '#00ADD8' },
        { name: 'Python', percentage: 20, color: '#3572A5' },
        { name: 'Shell', percentage: 12, color: '#89e051' }
      ],
      featuredRepos: [
        {
          title: 'kube-cost-optimizer',
          description: 'Dynamic pod right-sizing controller using predictive memory time-series models.',
          techStack: ['Go', 'Kubernetes API', 'Prometheus'],
          githubUrl: 'https://github.com/elena-cloud/kube-cost',
          starsCount: 540
        }
      ]
    },
    linkedin: {
      profileUrl: 'https://linkedin.com/in/elena-rostova-cloud',
      headline: 'Cloud Infrastructure Intern @ Datadog | MS @ Carnegie Mellon University',
      connectionsCount: 810,
      education: 'M.S. Information Networking, CMU',
      pastInternships: ['Infra Intern @ Datadog', 'Backend Intern @ Amazon Web Services'],
      verifiedStudent: true
    },
    socials: {
      github: 'https://github.com/elena-cloud',
      linkedin: 'https://linkedin.com/in/elena-rostova-cloud'
    },
    synergyScore: 93,
    synergyReason: '🚀 Bulletproof Infrastructure! Elena builds enterprise-grade cloud backends while you move fast on product & UI.',
    complementarySkills: ['Go Microservices', 'Kubernetes Controllers', 'Postgres Tuning'],
    sharedInterests: ['Startup Scaling', 'Distributed Backend Architecture']
  },
  {
    id: 'user-6',
    name: 'Jordan Lee',
    handle: '@jordan_algo',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&auto=format&fit=crop&q=80',
    university: 'Harvard University',
    major: 'Mathematics & Computer Science',
    graduationYear: 2027,
    location: 'Cambridge, MA',
    isRemoteAvailable: true,
    experienceLevel: 'Sophomore',
    primaryRole: 'AI / ML Engineer',
    tagline: 'LeetCode Guardian (2450+ rating), ICPC Regional finalist. Looking for FAANG mock interview partners!',
    bio: 'Sophomore at Harvard studying Math + CS. Top 0.2% on LeetCode with 900+ solved problems. Love discussing dynamic programming, graph theory, and algorithmic complexity. Ready to do weekly mock technical interviews and DSA grind.',
    skills: {
      languages: ['C++', 'Python', 'Java', 'Rust'],
      frameworks: ['NumPy', 'PyTorch', 'NetworkX', 'OpenCV'],
      toolsAndCloud: ['Git', 'Linux', 'LaTeX', 'Jupyter'],
      domains: ['Algorithms & Data Structures', 'Competitive Programming', 'Graph Theory', 'Math Optimization']
    },
    intents: ['LeetCode / DSA Partner', 'Project Peer Review', 'Casual Tech Chat'],
    badges: [
      { label: '🥇 LeetCode Guardian 2450', icon: 'Award', variant: 'gold' },
      { label: '🏆 ICPC North America Finalist', icon: 'Trophy', variant: 'cyan' },
      { label: '🎓 Harvard \'27', icon: 'GraduationCap', variant: 'purple' }
    ],
    github: {
      username: 'jordan-algo-mit',
      reposCount: 19,
      starsCount: 410,
      totalCommitsThisYear: 670,
      currentStreakDays: 120,
      topLanguages: [
        { name: 'C++', percentage: 75, color: '#f34b7d' },
        { name: 'Python', percentage: 25, color: '#3572A5' }
      ],
      featuredRepos: [
        {
          title: 'competitive-programming-handbook-code',
          description: 'Annotated C++ implementations of advanced graph, tree, and string algorithms.',
          techStack: ['C++', 'Algorithms'],
          githubUrl: 'https://github.com/jordan-algo-mit/cp-handbook',
          starsCount: 380
        }
      ]
    },
    linkedin: {
      profileUrl: 'https://linkedin.com/in/jordan-lee-math',
      headline: 'Math & CS @ Harvard | Incoming SWE Intern @ Citadel Securities',
      connectionsCount: 530,
      education: 'A.B. Mathematics & Computer Science, Harvard University',
      pastInternships: ['Quant SWE Intern @ Hudson River Trading'],
      verifiedStudent: true
    },
    socials: {
      github: 'https://github.com/jordan-algo-mit',
      linkedin: 'https://linkedin.com/in/jordan-lee-math'
    },
    synergyScore: 82,
    synergyReason: '🧠 DSA Grind Partner! Perfect match for mastering LeetCode hard problems & top-tier tech mock interviews.',
    complementarySkills: ['Competitive DSA', 'Graph Optimization', 'Quant Problem Solving'],
    sharedInterests: ['FAANG Mock Interviews', 'System Design']
  }
];

export const INITIAL_MATCHES = [
  {
    id: 'match-1',
    matchedAt: '10 mins ago',
    userProfile: PROFILES_DECK[0], // Sophia Zhang
    lastMessage: "Hey Alex! Loved your canvas-ai project. I'm looking for a frontend partner for HackMIT!",
    unreadCount: 1,
    intent: 'Hackathon Teammate' as IntentType,
    synergyScore: 96
  },
  {
    id: 'match-2',
    matchedAt: '2 hours ago',
    userProfile: PROFILES_DECK[2], // Priya Patel
    lastMessage: 'Your Next.js stack with my Three.js shaders would make a killer hackathon project 🔥',
    unreadCount: 0,
    intent: 'Hackathon Teammate' as IntentType,
    synergyScore: 88
  }
];

export const INITIAL_CHAT_MESSAGES: Record<string, any[]> = {
  'user-1': [
    {
      id: 'msg-1',
      senderId: 'user-1',
      receiverId: 'user-me',
      text: "Hey Alex! Saw your GitHub repos — your canvas-ai repo is super clean! 🚀",
      timestamp: '10:14 AM'
    },
    {
      id: 'msg-2',
      senderId: 'user-me',
      receiverId: 'user-1',
      text: "Thanks Sophia! I saw your NeurIPS paper and your nano-reasoner framework on Apple Silicon. That's seriously impressive work!",
      timestamp: '10:16 AM'
    },
    {
      id: 'msg-3',
      senderId: 'user-1',
      receiverId: 'user-me',
      text: "Thank you! I was thinking: are you planning to participate in HackMIT next month? I've been designing a local streaming agent pipeline and really need an elite frontend engineer to build the collaborative canvas UI.",
      timestamp: '10:18 AM'
    },
    {
      id: 'msg-4',
      senderId: 'user-1',
      receiverId: 'user-me',
      text: "Here is the raw streaming endpoint snippet we could connect directly to your Next.js Server Actions:",
      timestamp: '10:19 AM',
      codeSnippet: {
        language: 'python',
        code: `@app.post("/v1/agent/stream")\nasync def stream_reasoning(prompt: AgentPrompt):\n    generator = model.generate_with_reasoning(\n        prompt.text, \n        max_tokens=2048,\n        temperature=0.7\n    )\n    async for token, thoughts in generator:\n        yield f"event: delta\\ndata: {json.dumps({'token': token, 'thought': thoughts})}\\n\\n"`
      }
    }
  ],
  'user-3': [
    {
      id: 'msg-p1',
      senderId: 'user-3',
      receiverId: 'user-me',
      text: "Hi Alex! Love your profile. Your Next.js stack with my Three.js shaders would make a killer hackathon project 🔥",
      timestamp: 'Yesterday'
    }
  ]
};

export const SAMPLE_SQUADS = [
  {
    id: 'squad-1',
    name: 'NeuralCanvas Alpha',
    hackathonName: 'HackMIT 2026',
    targetDate: 'Oct 14-16, 2026',
    description: 'Building an interactive AI design companion with local reasoning and dynamic WebGL shaders.',
    slots: [
      {
        role: 'Frontend & UI Architect',
        requiredSkills: ['Next.js', 'React', 'TailwindCSS'],
        assignedMember: CURRENT_USER
      },
      {
        role: 'AI / ML Specialist',
        requiredSkills: ['PyTorch', 'LangGraph', 'FastAPI'],
        assignedMember: PROFILES_DECK[0]
      },
      {
        role: 'Creative / 3D Designer',
        requiredSkills: ['Three.js', 'GLSL', 'Figma'],
        assignedMember: PROFILES_DECK[2]
      },
      {
        role: 'Systems / Cloud Infra',
        requiredSkills: ['Go', 'Docker', 'Kubernetes'],
        assignedMember: undefined
      }
    ]
  }
];
