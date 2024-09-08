// src/app/api/user/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticate } from '../../middleware';
import { NextRequestWithUser } from '../../type';

export async function GET(req: NextRequestWithUser) {
  try {
    const authFailed = await authenticate(req);
    if (authFailed) {
      return authFailed;
    }

    const user = req.user;

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
