// app/api/auth/login/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { addToValidTokens, getValidTokens } from '../../middleware';
import { NextRequestWithUser } from '../../type';

export async function POST(req: NextRequestWithUser) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
    }

    let token = getValidTokens(user.id);

    if (!token) {
      token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '10d'
      });
      addToValidTokens(user.id, token);
    }

    const connectedUser = req.user;
    return NextResponse.json({ token, connectedUser }, { status: 200 });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
