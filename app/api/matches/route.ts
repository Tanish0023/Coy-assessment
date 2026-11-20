import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CURRENT_USER_ID } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Fetch all mutual matches for CURRENT_USER_ID
    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { user1Id: CURRENT_USER_ID },
          { user2Id: CURRENT_USER_ID },
        ],
      },
      include: {
        user1: {
          include: { profile: true },
        },
        user2: {
          include: { profile: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // 2. Format matches with partner's profile information
    const formattedMatches = matches.map((m) => {
      const isUser1Current = m.user1Id === CURRENT_USER_ID;
      const partnerUser = isUser1Current ? m.user2 : m.user1;
      const partnerProfile = partnerUser.profile;

      let interests: string[] = [];
      if (partnerProfile?.interests) {
        try {
          interests = JSON.parse(partnerProfile.interests);
        } catch {
          interests = [];
        }
      }

      return {
        id: m.id,
        createdAt: m.createdAt,
        matchedAt: m.createdAt.toISOString(),
        profile: partnerProfile
          ? {
              id: partnerProfile.id,
              userId: partnerProfile.userId,
              name: partnerProfile.name,
              age: partnerProfile.age,
              photoUrl: partnerProfile.photoUrl,
              bio: partnerProfile.bio,
              cityOrCollege: partnerProfile.cityOrCollege,
              occupation: partnerProfile.occupation,
              interests,
              verified: partnerProfile.verified,
            }
          : null,
      };
    });

    return NextResponse.json({
      success: true,
      count: formattedMatches.length,
      matches: formattedMatches,
    });
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve matches.' },
      { status: 500 }
    );
  }
}
