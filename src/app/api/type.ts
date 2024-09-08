import { User as PrismaUser } from '@prisma/client';
import { NextRequest } from 'next/server';

type UserWithoutPassword = Omit<PrismaUser, 'password'> & {
  password?: string;
};

export type NextRequestWithUser = NextRequest & { user?: UserWithoutPassword };
