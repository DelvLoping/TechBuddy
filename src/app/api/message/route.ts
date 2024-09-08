// src/app/api/message/route.ts

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

    let messages;

    if (user.type === ADMIN) {
      messages = await prisma.message.findMany();
    } else {
      messages = await prisma.message.findMany({
        where: {
          userId: user.id
        }
      });
    }

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}

export async function POST(req: NextRequestWithUser) {
  try {
    const authFailed = await authenticate(req);
    if (authFailed) {
      return authFailed;
    }

    const { chatId, content } = await req.json();
    const user = req.user;

    if (!chatId || !content) {
      return NextResponse.json({ message: 'Chat ID and content are required' }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        chatId: Number(chatId),
        userId: user.id,
        content
      }
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
