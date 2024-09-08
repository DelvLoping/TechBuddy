// src/app/api/chat/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticate } from '../middleware';
import { NextRequestWithUser } from '../type';
import { ADMIN, HELPER, TECHBUDDY } from '@/constant';

export async function GET(req: NextRequestWithUser) {
  try {
    const authFailed = await authenticate(req);
    if (authFailed) {
      return authFailed;
    }
    const user = req.user;

    let chats;
    const url = new URL(req.url);
    const helpRequestId = url.searchParams.get('helpRequestId');

    if (user.type === ADMIN) {
      chats = await prisma.chat.findMany({
        include: {
          user1: { select: { id: true, firstname: true, lastname: true } },
          user2: { select: { id: true, firstname: true, lastname: true } }
        },
        where: {
          requestId: Number(helpRequestId) || undefined
        }
      });
    } else {
      chats = await prisma.chat.findMany({
        where: {
          OR: [{ user1Id: user.id }, { user2Id: user.id }],
          AND: [{ requestId: Number(helpRequestId) || undefined }]
        },
        include: {
          user1: { select: { id: true, firstname: true, lastname: true } },
          user2: { select: { id: true, firstname: true, lastname: true } }
        }
      });
    }

    return NextResponse.json({ chats }, { status: 200 });
  } catch (error) {
    console.error('Error fetching chats:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}

export async function POST(req: NextRequestWithUser) {
  try {
    const authFailed = await authenticate(req);
    if (authFailed) {
      return authFailed;
    }

    const { requestId, user2Id } = await req.json();
    const user = req.user;

    if (!requestId || !user2Id) {
      return NextResponse.json(
        { message: 'Request ID and user2 ID are required' },
        { status: 400 }
      );
    }

    const chat = await prisma.chat.create({
      data: {
        requestId: Number(requestId),
        user1Id: user.type === TECHBUDDY ? user.id : user2Id,
        user2Id: user.type === HELPER ? user.id : user2Id
      }
    });

    return NextResponse.json({ chat }, { status: 201 });
  } catch (error) {
    console.error('Error creating chat:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
