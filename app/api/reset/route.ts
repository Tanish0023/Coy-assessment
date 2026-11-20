import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CURRENT_USER_ID } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export async function POST() {

  try {
    // Delete matches and swipes created by current user
    await prisma.match.deleteMany({
      where: {
        OR: [
          { user1Id: CURRENT_USER_ID },
          { user2Id: CURRENT_USER_ID },
        ],
      },
    });

    await prisma.swipe.deleteMany({
      where: {
        swiperId: CURRENT_USER_ID,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Demo swipes and matches reset successfully.',
    });
  } catch (error) {
    console.error('Error resetting demo feed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reset demo feed.' },
      { status: 500 }
    );
  }
}
