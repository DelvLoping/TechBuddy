// src/app/api/user/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticate } from '../middleware';
import { NextRequestWithUser } from '../type';
import { callAPIOpenAI } from '../services/openAiHelper';

export async function POST(req: NextRequestWithUser) {
  try {
    const authFailed = await authenticate(req);
    if (authFailed) {
      return authFailed;
    }

    const user = req.user;
    const { userPrompt, context } = await req.json();

    console.log('userPrompt', userPrompt);
    if (!userPrompt) {
      return NextResponse.json({ message: 'Prompt is required' }, { status: 400 });
    }

    const updatedContext = await callAPIOpenAI(userPrompt, context);

    return NextResponse.json({ updatedContext }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
