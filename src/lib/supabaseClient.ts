import { createClient } from '@supabase/supabase-js';
import { TechProfile } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xesdrhqkoaieataywrlj.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhlc2RyaHFrb2FpZWF0YXl3cmxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczNzUwNjcsImV4cCI6MjEwMjk1MTA2N30.8Fmua8VTKlyUDfcQrzarZel09FZtKfQSwxwYiI4k-cM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Registers or updates a student developer profile in Supabase
 */
export async function registerStudentProfile(profile: TechProfile): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = {
      id: profile.id,
      name: profile.name,
      handle: profile.handle,
      avatar: profile.avatar,
      university: profile.university,
      major: profile.major,
      graduation_year: profile.graduationYear,
      location: profile.location,
      is_remote_available: profile.isRemoteAvailable,
      experience_level: profile.experienceLevel,
      primary_role: profile.primaryRole,
      tagline: profile.tagline,
      bio: profile.bio,
      skills: profile.skills,
      intents: profile.intents,
      badges: profile.badges,
      github: profile.github,
      linkedin: profile.linkedin,
      socials: profile.socials,
      custom_links: profile.customLinks || [],
      agreed_to_terms: true
    };

    const { error } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.error('[Supabase] Error registering profile:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('[Supabase] Exception in registerStudentProfile:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Fetches real active developer profiles from database
 */
export async function fetchActiveProfiles(excludeUserId?: string): Promise<TechProfile[]> {
  try {
    let query = supabase.from('profiles').select('*').order('created_at', { ascending: false });

    if (excludeUserId) {
      // Optional filter, but keep all active profiles by default
    }

    const { data, error } = await query;

    if (error || !data) {
      console.warn('[Database] Could not fetch profiles from DB:', error);
      return [];
    }

    return data.map((row: any) => ({
      id: row.id,
      name: row.name,
      handle: row.handle,
      avatar: row.avatar,
      coverImage: row.cover_image,
      university: row.university,
      major: row.major,
      graduationYear: row.graduation_year,
      location: row.location,
      isRemoteAvailable: row.is_remote_available,
      experienceLevel: row.experience_level,
      primaryRole: row.primary_role,
      tagline: row.tagline,
      bio: row.bio,
      skills: row.skills || { languages: [], frameworks: [], toolsAndCloud: [], domains: [] },
      intents: row.intents || [],
      badges: row.badges || [],
      github: row.github || { username: 'dev', reposCount: 0, starsCount: 0, totalCommitsThisYear: 0, currentStreakDays: 0, topLanguages: [], featuredRepos: [] },
      linkedin: row.linkedin || { profileUrl: '', headline: '', connectionsCount: 0, education: '', pastInternships: [], verifiedStudent: false },
      socials: row.socials || {},
      customLinks: row.custom_links || []
    }));
  } catch (err) {
    console.error('[Supabase] Exception in fetchActiveProfiles:', err);
    return [];
  }
}

/**
 * Records a swipe in Supabase
 */
export async function recordUserSwipe(
  swiperId: string, 
  targetId: string, 
  direction: 'left' | 'right' | 'super'
): Promise<void> {
  try {
    await supabase.from('swipes').upsert({
      swiper_id: swiperId,
      target_id: targetId,
      direction
    }, { onConflict: 'swiper_id,target_id' });
  } catch (e) {
    console.warn('[Supabase] Could not record swipe:', e);
  }
}

/**
 * Records a mutual match in Supabase
 */
export async function recordMatch(user1Id: string, user2Id: string, synergyScore: number): Promise<void> {
  try {
    await supabase.from('matches').insert({
      user1_id: user1Id,
      user2_id: user2Id,
      synergy_score: synergyScore
    });
  } catch (e) {
    console.warn('[Supabase] Could not record match:', e);
  }
}

/**
 * Sends a real chat message to Supabase
 */
export async function sendChatMessageToSupabase(
  senderId: string, 
  receiverId: string, 
  text: string, 
  codeSnippet?: any
): Promise<void> {
  try {
    await supabase.from('messages').insert({
      sender_id: senderId,
      receiver_id: receiverId,
      text,
      code_snippet: codeSnippet || null
    });
  } catch (e) {
    console.warn('[Supabase] Could not send message to DB:', e);
  }
}
