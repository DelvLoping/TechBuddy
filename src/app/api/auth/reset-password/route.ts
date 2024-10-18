// app/api/auth/register/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { NextRequestWithUser } from '../../type';
import moment from 'moment';

export async function POST(req: NextRequestWithUser) {
  try {
    const { token, newPassword } = await req.json();

    if (!token) {
      return NextResponse.json({ message: 'Token is required' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { resetPasswordToken: token }
    });

    if (
      !user ||
      !user.resetPasswordTokenExpiry ||
      moment(user.resetPasswordTokenExpiry).isBefore(moment())
    ) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 400 });
    }

    const password = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password,
        resetPasswordToken: null,
        resetPasswordTokenExpiry: null
      }
    });

    return NextResponse.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
