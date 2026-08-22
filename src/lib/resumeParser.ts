/**
 * Client-side resume skill extractor
 * Scans resume text for programming languages, frameworks, cloud tools, databases, and roles.
 */

const KNOWN_SKILLS = [
  // Languages
  'TypeScript', 'JavaScript', 'Python', 'Java', 'C++', 'C#', 'C', 'Rust', 'Go', 'Golang',
  'PHP', 'Ruby', 'Swift', 'Kotlin', 'Dart', 'SQL', 'R', 'Scala', 'HTML', 'CSS', 'Bash', 'Solidity', 'Zig',
  
  // Frameworks & Libraries
  'React', 'Next.js', 'Vue', 'Nuxt', 'Angular', 'Svelte', 'Node.js', 'Express', 'FastAPI', 
  'Django', 'Flask', 'Spring Boot', 'TailwindCSS', 'Tailwind', 'Bootstrap', 'PyTorch', 'TensorFlow', 
  'Keras', 'Hugging Face', 'LangChain', 'LangGraph', 'GraphQL', 'tRPC', 'Prisma', 'Drizzle',
  'Three.js', 'React Native', 'Flutter', 'Redux', 'Zustand', 'Pandas', 'NumPy', 'Scikit-Learn',
  
  // Cloud & DevOps & Tools
  'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Vercel', 'Netlify', 'PostgreSQL', 'MongoDB', 
  'MySQL', 'Redis', 'Firebase', 'Supabase', 'Git', 'GitHub', 'CI/CD', 'Linux', 'Nginx',
  'Elasticsearch', 'Kafka', 'RabbitMQ', 'Jupyter', 'Weights & Biases', 'Prometheus', 'Grafana'
];

const ROLE_KEYWORDS: Record<string, string[]> = {
  'AI / ML Engineer': ['machine learning', 'deep learning', 'pytorch', 'tensorflow', 'llm', 'nlp', 'computer vision', 'neural network', 'data science', 'ai'],
  'Frontend': ['frontend', 'react', 'next.js', 'vue', 'tailwind', 'ui/ux', 'css', 'javascript', 'typescript', 'responsive'],
  'Backend': ['backend', 'api', 'microservices', 'postgresql', 'database', 'rest', 'golang', 'node.js', 'express', 'django', 'fastapi'],
  'Full-Stack': ['fullstack', 'full-stack', 'mern', 'mean', 'full stack web', 'software engineer'],
  'Systems / DevOps': ['devops', 'kubernetes', 'docker', 'cloud', 'aws', 'linux', 'ci/cd', 'terraform', 'infrastructure', 'rust', 'c++'],
  'Mobile Dev': ['mobile', 'react native', 'flutter', 'ios', 'android', 'swift', 'kotlin'],
  'UI/UX & Product': ['figma', 'ui/ux', 'user experience', 'wireframes', 'prototyping', 'product design']
};

export interface ResumeParseResult {
  extractedSkills: string[];
  suggestedRole?: 'Frontend' | 'Backend' | 'Full-Stack' | 'AI / ML Engineer' | 'Mobile Dev' | 'Systems / DevOps' | 'UI/UX & Product';
  extractedTextLength: number;
}

export async function parseResumeFile(file: File): Promise<ResumeParseResult> {
  let text = '';

  try {
    text = await file.text();
  } catch (e) {
    // If binary, try arrayBuffer to string extraction
    try {
      const buffer = await file.arrayBuffer();
      const decoder = new TextDecoder('utf-8', { fatal: false });
      text = decoder.decode(buffer);
    } catch (err) {
      console.warn('Could not read file buffer as text:', err);
    }
  }

  const normalizedText = text.toLowerCase();
  const matchedSkills: string[] = [];

  // Match skills with word boundary
  for (const skill of KNOWN_SKILLS) {
    const escaped = skill.toLowerCase().replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(normalizedText)) {
      matchedSkills.push(skill);
    }
  }

  // Detect suggested role based on keyword frequency
  let maxHits = 0;
  let detectedRole: any = 'Full-Stack';

  for (const [role, keywords] of Object.entries(ROLE_KEYWORDS)) {
    let hits = 0;
    for (const kw of keywords) {
      if (normalizedText.includes(kw)) {
        hits++;
      }
    }
    if (hits > maxHits) {
      maxHits = hits;
      detectedRole = role;
    }
  }

  return {
    extractedSkills: Array.from(new Set(matchedSkills)),
    suggestedRole: detectedRole,
    extractedTextLength: text.length
  };
}
