import { User as PrismaUser } from '@prisma/client';
import { NextRequest } from 'next/server';

type UserWithoutPassword = Omit<
  PrismaUser,
  | 'password'
  | 'verificationToken'
  | 'verificationTokenExpiry'
  | 'resetPasswordToken'
  | 'resetPasswordTokenExpiry'
> & {
  password?: string;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  resetPasswordToken?: string;
  resetPasswordTokenExpiry?: Date;
};

export type NextRequestWithUser = NextRequest & { user?: UserWithoutPassword };
