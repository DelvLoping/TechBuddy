// src/app/api/ai-chat/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticate } from '../middleware';
import { NextRequestWithUser } from '../type';
import { ADMIN } from '@/constant';

export async function GET(req: NextRequestWithUser) {
  try {
    const authFailed = await authenticate(req);
    if (authFailed) {
      return authFailed;
    }
    const user = req.user;

    let aiChats;

    if (user.type === ADMIN) {
      aiChats = await prisma.aIChat.findMany();
    } else {
      aiChats = await prisma.aIChat.findMany({
        where: {
          userId: user.id
        }
      });
    }

    return NextResponse.json({ aiChats }, { status: 200 });
  } catch (error) {
    console.error('Error fetching AI chats:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}

export async function POST(req: NextRequestWithUser) {
  try {
    const authFailed = await authenticate(req);
    if (authFailed) {
      return authFailed;
    }
    const aiChat = await prisma.aIChat.create({
      data: {
        userId: req.user.id
      }
    });

    return NextResponse.json({ aiChat }, { status: 201 });
  } catch (error) {
    console.error('Error creating AI chat:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
