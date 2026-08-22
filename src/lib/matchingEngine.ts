import { TechProfile } from '@/types';

interface SynergyAnalysis {
  score: number;
  reason: string;
  complementarySkills: string[];
  sharedInterests: string[];
  roleSynergyType: 'COMPLEMENTARY' | 'PEER_ACCELERATOR' | 'SPECIALIST_PAIR';
}

const COMPLEMENTARY_ROLE_PAIRS: Record<string, string[]> = {
  'Frontend': ['Backend', 'AI / ML Engineer', 'Systems / DevOps', 'UI/UX & Product'],
  'Full-Stack': ['AI / ML Engineer', 'Systems / DevOps', 'UI/UX & Product', 'Mobile Dev'],
  'Backend': ['Frontend', 'UI/UX & Product', 'Mobile Dev', 'AI / ML Engineer'],
  'AI / ML Engineer': ['Frontend', 'Full-Stack', 'UI/UX & Product', 'Systems / DevOps'],
  'UI/UX & Product': ['Frontend', 'Full-Stack', 'Mobile Dev', 'AI / ML Engineer'],
  'Mobile Dev': ['Backend', 'UI/UX & Product', 'Full-Stack'],
  'Systems / DevOps': ['Full-Stack', 'Frontend', 'AI / ML Engineer'],
  'Web3 / Blockchain': ['Frontend', 'UI/UX & Product', 'Systems / DevOps']
};

export function calculateSynergy(userA: TechProfile, userB: TechProfile): SynergyAnalysis {
  let score = 50; // base score

  // 1. Role Complementarity (+25 pts)
  const complementaryRoles = COMPLEMENTARY_ROLE_PAIRS[userA.primaryRole] || [];
  const isComplementaryRole = complementaryRoles.includes(userB.primaryRole);
  const isSameRole = userA.primaryRole === userB.primaryRole;

  let roleSynergyType: 'COMPLEMENTARY' | 'PEER_ACCELERATOR' | 'SPECIALIST_PAIR' = 'COMPLEMENTARY';

  if (isComplementaryRole) {
    score += 25;
    roleSynergyType = 'COMPLEMENTARY';
  } else if (isSameRole) {
    score += 15;
    roleSynergyType = 'PEER_ACCELERATOR';
  } else {
    score += 10;
  }

  // 2. Shared Intents (+15 pts)
  const sharedIntents = userA.intents.filter(i => userB.intents.includes(i));
  if (sharedIntents.length > 0) {
    score += Math.min(15, sharedIntents.length * 8);
  }

  // 3. Complementary & Shared Skills (+10 pts)
  const userASkills = new Set([
    ...userA.skills.languages,
    ...userA.skills.frameworks,
    ...userA.skills.toolsAndCloud
  ]);

  const candidateSkills = [
    ...userB.skills.languages,
    ...userB.skills.frameworks,
    ...userB.skills.toolsAndCloud
  ];

  const complementarySkills = candidateSkills.filter(skill => !userASkills.has(skill)).slice(0, 4);
  const sharedSkills = candidateSkills.filter(skill => userASkills.has(skill));

  if (complementarySkills.length >= 2) {
    score += 8;
  }
  if (sharedSkills.length >= 1) {
    score += 5;
  }

  // 4. Domains and Interests (+10 pts)
  const sharedDomains = userA.skills.domains.filter(d => 
    userB.skills.domains.some(cd => cd.toLowerCase().includes(d.toLowerCase()) || d.toLowerCase().includes(cd.toLowerCase()))
  );
  if (sharedDomains.length > 0) {
    score += Math.min(10, sharedDomains.length * 5);
  }

  // 5. Cap score nicely
  score = Math.min(99, Math.max(65, score));

  // Formulate natural reason
  let reason = '';
  if (isComplementaryRole && complementarySkills.length > 0) {
    reason = `🔥 High Synergy Match! ${userB.name.split(' ')[0]} brings strong ${complementarySkills.slice(0, 2).join(' & ')} to pair with your ${userA.primaryRole} expertise.`;
  } else if (sharedIntents.includes('Hackathon Teammate')) {
    reason = `🏆 Hackathon Power Pair! Both looking to build high-impact demos with complementary stacks.`;
  } else if (sharedIntents.includes('LeetCode / DSA Partner')) {
    reason = `🧠 Peer Accelerator! Great match for practicing advanced data structures and technical mock interviews.`;
  } else {
    reason = `✨ Great Tech Synergy! Shared focus on ${userB.skills.domains[0] || 'engineering'} with complementary workflows.`;
  }

  return {
    score,
    reason,
    complementarySkills,
    sharedInterests: sharedDomains.length > 0 ? sharedDomains : userB.skills.domains.slice(0, 2),
    roleSynergyType
  };
}
