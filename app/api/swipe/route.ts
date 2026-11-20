import { NextRequest, NextResponse } from 'next/server';
import { recordSwipe, SwipeAction } from '@/lib/matching';
import { CURRENT_USER_ID } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profileId, action } = body;

    // 1. Validate inputs
    if (!profileId || typeof profileId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid profileId.' },
        { status: 400 }
      );
    }

    if (!action || (action !== 'like' && action !== 'pass')) {
      return NextResponse.json(
        { success: false, error: 'Action must be either "like" or "pass".' },
        { status: 400 }
      );
    }

    // 2. Perform atomic swipe and match detection
    const result = await recordSwipe(
      CURRENT_USER_ID,
      profileId,
      action as SwipeAction
    );

    if (!result.success) {
      const statusCode = result.error?.includes('already been swiped') ? 409 : 400;
      return NextResponse.json(
        { success: false, error: result.error },
        { status: statusCode }
      );
    }

    // 3. Return response conforming to assignment spec
    if (result.matched && result.match) {
      return NextResponse.json({
        success: true,
        matched: true,
        match: result.match,
      });
    }

    return NextResponse.json({
      success: true,
      matched: false,
    });
  } catch (error) {
    console.error('Error handling swipe:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error processing swipe.' },
      { status: 500 }
    );
  }
}
