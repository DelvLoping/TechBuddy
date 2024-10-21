// app/api/auth/login/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { addToValidTokens, getValidTokens } from '../../middleware';
import { NextRequestWithUser } from '../../type';
import { sendMagicLinkMail } from '../../services/mailService';

export async function POST(req: NextRequestWithUser) {
  try {
    const { email } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
    }

    let token = await getValidTokens(user.id);

    if (!token) {
      token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '10d'
      });
      await addToValidTokens(user.id, token);
    }

    const connectedUser = req.user;

    const magicLink = `${process.env.APP_URL}/magic-link-sent?token=${token}`;
    await sendMagicLinkMail(email, magicLink);

    return NextResponse.json({ message: 'Magic link sent' }, { status: 200 });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
