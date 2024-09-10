// app/api/auth/register/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { addToValidTokens } from '@/app/api/middleware';
import { NextRequestWithUser } from '../../type';

export async function POST(req: NextRequestWithUser) {
  try {
    const { email, password, firstname, lastname, age, address, type } = await req.json();
    const { street, city, postalCode, country } = address || {};

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    let addressId;
    if (address && type === 'HELPER') {
      try {
        const createdAddress = await prisma.address.create({
          data: {
            street,
            city,
            postalCode,
            country
          }
        });

        addressId = createdAddress.id;
      } catch (error) {
        console.error('Error creating address:', error);
        throw new Error('Failed to create address');
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstname,
        lastname,
        age: parseInt(age) || undefined,
        type,
        address: addressId ? { connect: { id: addressId } } : undefined
      }
    });

    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '10d'
    });

    addToValidTokens(newUser.id, token);

    return NextResponse.json({ message: 'User created', user: newUser, token }, { status: 201 });
  } catch (error) {
    console.error('Error during registration:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
