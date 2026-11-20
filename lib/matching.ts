import { prisma } from './prisma';
import { CURRENT_USER_ID } from './constants';

export type SwipeAction = 'like' | 'pass';

export interface SwipeResult {
  success: boolean;
  matched: boolean;
  match?: {
    id: string;
    profile: {
      id: string;
      name: string;
      age: number;
      photoUrl: string;
      bio: string;
      cityOrCollege: string;
      occupation: string | null;
      interests: string[];
    };
  };
  error?: string;
}

/**
 * Records a swipe and checks for a mutual match.
 * Uses a Prisma transaction for atomic swipe recording and match creation.
 */
export async function recordSwipe(
  swiperId: string,
  targetProfileId: string,
  action: SwipeAction
): Promise<SwipeResult> {
  const normalizedAction = action.toUpperCase() as 'LIKE' | 'PASS';

  if (!['LIKE', 'PASS'].includes(normalizedAction)) {
    return { success: false, matched: false, error: 'Invalid swipe action. Must be "like" or "pass".' };
  }

  // 1. Find target user and profile
  const targetProfile = await prisma.profile.findUnique({
    where: { id: targetProfileId },
    include: { user: true },
  });

  if (!targetProfile) {
    return { success: false, matched: false, error: 'Target profile not found.' };
  }

  const targetUserId = targetProfile.userId;

  if (swiperId === targetUserId) {
    return { success: false, matched: false, error: 'Cannot swipe on your own profile.' };
  }

  // 2. Prevent duplicate swipes
  const existingSwipe = await prisma.swipe.findUnique({
    where: {
      swiperId_swipedId: {
        swiperId,
        swipedId: targetUserId,
      },
    },
  });

  if (existingSwipe) {
    return {
      success: false,
      matched: false,
      error: 'Profile has already been swiped on.',
    };
  }

  // 3. Execute swipe in database transaction
  return await prisma.$transaction(async (tx) => {
    // Record current user's swipe
    await tx.swipe.create({
      data: {
        swiperId,
        swipedId: targetUserId,
        action: normalizedAction,
      },
    });

    // If action is PASS, cannot be a match
    if (normalizedAction === 'PASS') {
      return { success: true, matched: false };
    }

    // Check if target user has already liked swiper
    const reciprocalLike = await tx.swipe.findFirst({
      where: {
        swiperId: targetUserId,
        swipedId: swiperId,
        action: 'LIKE',
      },
    });

    if (!reciprocalLike) {
      // Swiped right, but other user hasn't liked yet (or passed).
      // STRICT PRIVACY: return matched: false, no hints!
      return { success: true, matched: false };
    }

    // MUTUAL MATCH! Create match record canonically ordered
    const [user1Id, user2Id] = [swiperId, targetUserId].sort();

    const matchRecord = await tx.match.upsert({
      where: {
        user1Id_user2Id: {
          user1Id,
          user2Id,
        },
      },
      update: {},
      create: {
        user1Id,
        user2Id,
      },
    });

    let parsedInterests: string[] = [];
    try {
      parsedInterests = JSON.parse(targetProfile.interests);
    } catch {
      parsedInterests = [];
    }

    return {
      success: true,
      matched: true,
      match: {
        id: matchRecord.id,
        profile: {
          id: targetProfile.id,
          name: targetProfile.name,
          age: targetProfile.age,
          photoUrl: targetProfile.photoUrl,
          bio: targetProfile.bio,
          cityOrCollege: targetProfile.cityOrCollege,
          occupation: targetProfile.occupation,
          interests: parsedInterests,
        },
      },
    };
  });
}
