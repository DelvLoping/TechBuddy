// src/app/api/user/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticate } from '../middleware';
import { ADMIN } from '@/constant';

export async function GET(req: NextRequest) {
  try {
    const authFailed = await authenticate(req);
    if (authFailed) {
      return authFailed;
    }

    const user = req.user;

    if (user.type !== ADMIN) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const resUser = await prisma.user.findMany({
      select: {
        id: true,
        lastname: true,
        firstname: true,
        email: true,
        age: true,
        addressId: true,
        type: true,
        signupDate: true,
        helpRequests: true,
        applications: true,
        chatsAsUser1: true,
        chatsAsUser2: true,
        messages: true,
        evaluationsGiven: true,
        evaluationsReceived: true,
        aiChats: true,
        address: true
      }
    });

    return NextResponse.json({ resUser }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
