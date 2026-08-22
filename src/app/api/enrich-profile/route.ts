import { NextRequest, NextResponse } from 'next/server';
import { enrichProfileFromPublicData } from '@/lib/profileEnricher';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { githubUsername, linkedinUrl, university, major, targetRole } = body;

    const enrichedProfile = await enrichProfileFromPublicData({
      githubUsername,
      linkedinUrl,
      university,
      major,
      targetRole
    });

    return NextResponse.json({
      success: true,
      profile: enrichedProfile
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to enrich profile' },
      { status: 500 }
    );
  }
}
