// src/app/api/message/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticate } from '../middleware';
import { ADMIN } from '@/constant';
import { NextRequestWithUser } from '../type';

export async function GET(req: NextRequestWithUser) {
  try {
    const authFailed = await authenticate(req);
    if (authFailed) {
      return authFailed;
    }
    const user = req.user;
    const url = new URL(req.url);
    const aiChatId = url.searchParams.get('aiChatId');

    if (!aiChatId) {
      return NextResponse.json({ message: 'AiChatId is required' }, { status: 400 });
    }

    let aIMessages;
    if (user.type === ADMIN) {
      aIMessages = await prisma.aIMessage.findMany();
    } else {
      aIMessages = await prisma.aIMessage.findMany({
        where: {
          aiChatId: Number(aiChatId)
        }
      });
    }

    return NextResponse.json({ aIMessages }, { status: 200 });
  } catch (error) {
    console.error('Error fetching ai messages:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}

export async function POST(req: NextRequestWithUser) {
  try {
    const authFailed = await authenticate(req);
    if (authFailed) {
      return authFailed;
    }

    const { aiChatId, content, sender } = await req.json();
    const user = req.user;

    if (!aiChatId || !content || !sender) {
      return NextResponse.json(
        { message: 'AiChatId, content and sender ("USER","AI") are required' },
        { status: 400 }
      );
    }

    const aIChat = await prisma.aIChat.findUnique({
      where: {
        id: Number(aiChatId)
      },
      select: {
        userId: true
      }
    });

    if (!aIChat) {
      return NextResponse.json({ message: 'Ai Chat not found' }, { status: 404 });
    }

    if (aIChat.userId !== user.id && user.type !== ADMIN) {
      return NextResponse.json(
        { message: 'You are not authorized to view this ai message' },
        { status: 403 }
      );
    }
    const aIMessage = await prisma.aIMessage.create({
      data: {
        aiChatId: Number(aiChatId),
        content,
        sender
      }
    });

    return NextResponse.json({ aIMessage }, { status: 201 });
  } catch (error) {
    console.error('Error creating ai message:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
