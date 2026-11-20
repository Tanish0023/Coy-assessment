import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CURRENT_USER_ID } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Get IDs of all users already swiped on by the logged-in user
    const swipedRecords = await prisma.swipe.findMany({
      where: { swiperId: CURRENT_USER_ID },
      select: { swipedId: true },
    });

    const excludedUserIds = [
      CURRENT_USER_ID,
      ...swipedRecords.map((s) => s.swipedId),
    ];

    // 2. Query available candidate profiles not yet swiped
    const profiles = await prisma.profile.findMany({
      where: {
        userId: {
          notIn: excludedUserIds,
        },
      },
      select: {
        id: true,
        name: true,
        age: true,
        photoUrl: true,
        bio: true,
        cityOrCollege: true,
        occupation: true,
        interests: true,
        verified: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // 3. Format and sanitize profiles (parse interests, ensure zero leak of likes)
    const sanitizedProfiles = profiles.map((p) => {
      let parsedInterests: string[] = [];
      try {
        parsedInterests = JSON.parse(p.interests);
      } catch {
        parsedInterests = [];
      }

      return {
        id: p.id,
        name: p.name,
        age: p.age,
        photoUrl: p.photoUrl,
        bio: p.bio,
        cityOrCollege: p.cityOrCollege,
        occupation: p.occupation,
        interests: parsedInterests,
        verified: p.verified,
      };
    });

    return NextResponse.json({
      success: true,
      count: sanitizedProfiles.length,
      profiles: sanitizedProfiles,
    });
  } catch (error) {
    console.error('Error fetching feed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load profile feed.' },
      { status: 500 }
    );
  }
}
