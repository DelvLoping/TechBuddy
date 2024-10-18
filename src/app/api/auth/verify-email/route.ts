// app/api/auth/register/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticate } from '@/app/api/middleware';
import { NextRequestWithUser } from '../../type';
import { sendWelcomeMail } from '../../services/mailService';
import moment from 'moment';

export async function POST(req: NextRequestWithUser) {
  try {
    const authFailed = await authenticate(req);
    if (authFailed) {
      return authFailed;
    }
    const userid = req.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userid }
    });

    const { token } = await req.json();

    if (user.emailVerified) {
      return NextResponse.json({ message: 'User already verified' }, { status: 400 });
    }

    if (
      user.verificationToken !== token ||
      !user.verificationTokenExpiry ||
      moment(user.verificationTokenExpiry).isBefore(moment())
    ) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationTokenExpiry: null
      }
    });

    await sendWelcomeMail(user.email);
    return NextResponse.json({ message: 'Email verified' });
  } catch (error) {
    console.error('Error during registration:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
