// api/middleware.ts

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { NextRequestWithUser } from './type';

const validTokens = new Map<number, string>();

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

    if (!validTokens.has(decoded.userId) && process.env.NODE_ENV !== 'development') {
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
export function getValidTokens(id: number) {
  return validTokens.get(id);
}
export function addToValidTokens(id: number, token: string) {
  validTokens.set(id, token);
}

export function removeFromValidTokens(id: number) {
  validTokens.delete(id);
}

export const authenticate = async (req: NextRequestWithUser) => {
  const isAuthenticated = await verifyToken(req);
  if (!isAuthenticated) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
};
