// src/app/api/message/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { NextRequestWithUser } from '../type';
import { sendMail } from '../services/mailService';

export async function POST(req: NextRequestWithUser) {
  try {
    await sendMail('florent.delobe@yahoo.fr', 'Welcome to our platform', 'Welcome to our platform');
    return NextResponse.json({ message: 'Email sent' }, { status: 201 });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
