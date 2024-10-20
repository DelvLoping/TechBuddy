// app/api/auth/register/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { addToValidTokens, authenticate } from '@/app/api/middleware';
import { NextRequestWithUser } from '../../type';
import { sendVerificationMail } from '../../services/mailService';
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

    if (user.emailVerified) {
      return NextResponse.json({ message: 'User already verified' }, { status: 400 });
    }

    const newToken = crypto.randomBytes(32).toString('hex');

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken: newToken,
        verificationTokenExpiry: moment().add(30, 'minutes').toDate()
      }
    });

    const verificationLink = `${process.env.APP_URL}/verify-email?token=${newToken}`;
    await sendVerificationMail(user.email, verificationLink);

    return NextResponse.json({ message: 'Verification email sent' });
  } catch (error) {
    console.error('Error during registration:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
