// app/api/auth/register/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { NextRequestWithUser } from '../../type';
import { sendResetPasswordMail, sendVerificationMail } from '../../services/mailService';
import moment from 'moment';

export async function POST(req: NextRequestWithUser) {
  try {
    const { email } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (user) {
      const newToken = crypto.randomBytes(32).toString('hex');
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetPasswordToken: newToken,
          resetPasswordTokenExpiry: moment().add(10, 'minutes').toDate()
        }
      });
      const resetLink = `${process.env.APP_URL}/reset-password?token=${newToken}`;
      sendResetPasswordMail(user.email, resetLink);
    }

    return NextResponse.json({ message: 'Reset password email sent' });
  } catch (error) {
    console.error('Error during registration:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
