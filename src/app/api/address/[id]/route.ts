// src/app/api/address/[id]/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticate } from '../../middleware';
import { NextRequestWithUser } from '../../type';
import { ADMIN, HELPER, TECHBUDDY } from '@/constant';

export async function GET(req: NextRequestWithUser, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const authFailed = await authenticate(req);
    if (authFailed) {
      return authFailed;
    }

    const address = await prisma.address.findUnique({
      where: {
        id: Number(id)
      }
    });

    if (!address) {
      return NextResponse.json({ message: 'Address not found' }, { status: 404 });
    }

    const helpRequests = await prisma.helpRequest.findMany({
      where: {
        interventionAddressId: Number(id)
      }
    });
    const userAdresses = await prisma.user.findMany({
      where: {
        addressId: Number(id)
      }
    });
    if (helpRequests.length === 0 && req.user.type !== ADMIN && userAdresses.length === 0) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ address }, { status: 200 });
  } catch (error: any) {
    console.error('Error getting address:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: error.status || 500 });
  }
}

export async function PUT(req: NextRequestWithUser, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const authFailed = await authenticate(req);
    if (authFailed) {
      return authFailed;
    }

    const { street, city, postalCode, country } = await req.json();

    const oldAddress = await prisma.address.findUnique({
      where: {
        id: Number(id)
      }
    });
    if (!oldAddress) {
      return NextResponse.json({ message: 'Address not found' }, { status: 404 });
    }

    const userAddresses = await prisma.user.findMany({
      where: {
        addressId: Number(id)
      }
    });
    const helpRequests = await prisma.helpRequest.findMany({
      where: {
        interventionAddressId: Number(id)
      }
    });

    if (req.user.type !== ADMIN && userAddresses.length === 0 && helpRequests.length === 0) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const address = await prisma.address.update({
      where: {
        id: Number(id)
      },
      data: {
        street,
        city,
        postalCode,
        country
      }
    });

    return NextResponse.json({ address }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating address:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: error.status || 500 });
  }
}

export async function DELETE(req: NextRequestWithUser, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const authFailed = await authenticate(req);
    if (authFailed) {
      return authFailed;
    }

    const address = await prisma.address.findUnique({
      where: {
        id: Number(id)
      }
    });

    if (!address) {
      return NextResponse.json({ message: 'Address not found' }, { status: 404 });
    }

    const userAddresses = await prisma.user.findMany({
      where: {
        addressId: Number(id)
      }
    });
    const helpRequests = await prisma.helpRequest.findMany({
      where: {
        interventionAddressId: Number(id)
      }
    });

    if (req.user.type !== ADMIN && userAddresses.length === 0 && helpRequests.length === 0) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await prisma.address.delete({
      where: {
        id: Number(id)
      }
    });

    return NextResponse.json({ address }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting address:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: error.status || 500 });
  }
}
