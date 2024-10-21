// app/api/auth/login/route.ts

import { NextResponse } from 'next/server';
import { authenticate, removeFromValidTokens } from '../../middleware';
import { NextRequestWithUser } from '../../type';

export async function GET(req: NextRequestWithUser) {
  try {
    const authFailed = await authenticate(req);
    if (authFailed) {
      return authFailed;
    }
    const userId = req.user?.id;
    if (userId) {
      await removeFromValidTokens(userId);
      return NextResponse.json({ message: 'User logged out' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('Error during logout:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
