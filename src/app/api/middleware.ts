// api/middleware.ts

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { NextRequestWithUser } from './type';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
export const EXPIRATION_TIME_IN_DAYS = 30;
export async function verifyToken(req: NextRequestWithUser): Promise<boolean> {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      return false;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as unknown as {
      userId: number;
    };

    const storedToken = await redis.get(`user:${decoded.userId}`);
    if (!storedToken || storedToken !== token) {
      return false;
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        lastname: true,
        firstname: true,
        email: true,
        age: true,
        addressId: true,
        type: true,
        signupDate: true,
        emailVerified: true,
        helpRequests: true,
        applications: true,
        chatsAsUser1: true,
        chatsAsUser2: true,
        evaluationsGiven: true,
        evaluationsReceived: true,
        aiChats: true,
        address: true
      }
    });
    if (!user) {
      return false;
    }

    req.user = user;

    return true;
  } catch (error) {
    console.error('Error verifying token:', error);
    return false;
  }
}
export async function getValidTokens(id: number) {
  return await redis.get(`user:${id}`);
}
export async function addToValidTokens(id: number, token: string) {
  await redis.set(`user:${id}`, token, 'EX', 60 * 60 * 24 * EXPIRATION_TIME_IN_DAYS);
}

export async function removeFromValidTokens(id: number) {
  await redis.del(`user:${id}`);
}

export const authenticate = async (req: NextRequestWithUser) => {
  const isAuthenticated = await verifyToken(req);
  if (!isAuthenticated) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
};
