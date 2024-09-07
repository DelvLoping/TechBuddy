// src/app/api/help-request/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticate } from '../../middleware';
import { ADMIN } from '@/constant';
import _ from 'lodash';

export async function GET(req: NextRequest, { params }) {
  try {
    const { id } = params;
    const authFailed = await authenticate(req);
    if (authFailed) {
      return authFailed;
    }

    const helpRequest = await prisma.helpRequest.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        user: {
          select: {
            id: true
          }
        },
        interventionAddress: {
          select: {
            id: true,
            street: true,
            city: true,
            postalCode: true,
            country: true
          }
        },
        applications: {
          select: {
            id: true,
            helperId: true,
            status: true
          }
        }
      }
    });

    if (!helpRequest) {
      return NextResponse.json({ message: 'Help request not found' }, { status: 404 });
    }
    if (
      req.user.type !== ADMIN &&
      helpRequest.userId !== req.user.id &&
      _.find(
        helpRequest.applications,
        (application) => application.helperId === req.user.id && application.status === 'ACCEPTED'
      ) === undefined
    ) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json({ helpRequest }, { status: 200 });
  } catch (error) {
    console.error('Error getting help request:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: error.status || 500 });
  }
}

export async function PUT(req: NextRequest, { params }) {
  try {
    const { id } = params;
    const authFailed = await authenticate(req);
    if (authFailed) {
      return authFailed;
    }

    const {
      subject,
      description,
      interventionType,
      reward,
      interventionDate,
      interventionAddress,
      status
    } = await req.json();
    const { city, postalCode, country, street } = interventionAddress || {};

    const user = req.user;

    const formattedInterventionDate = interventionDate
      ? new Date(interventionDate).toISOString()
      : undefined;
    const helpRequest = await prisma.helpRequest.findUnique({
      where: {
        id: Number(id)
      }
    });

    if (!helpRequest) {
      return NextResponse.json({ message: 'Help request not found' }, { status: 404 });
    }

    if (user.type !== ADMIN && helpRequest.userId !== user.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    let interventionAddressId;
    if (interventionAddress) {
      try {
        const createdAddress = await prisma.address.create({
          data: {
            street,
            city,
            postalCode,
            country
          }
        });

        interventionAddressId = createdAddress.id;
      } catch (error) {
        console.error('Error creating address:', error);
        throw new Error('Failed to create address');
      }
    }

    const updatedHelpRequest = await prisma.helpRequest.update({
      where: {
        id: Number(id)
      },
      data: {
        subject,
        description,
        interventionType,
        reward,
        interventionDate: formattedInterventionDate,
        interventionAddress: interventionAddressId
          ? {
              connect: {
                id: interventionAddressId
              }
            }
          : undefined,
        status
      }
    });

    return NextResponse.json({ helpRequest: updatedHelpRequest }, { status: 200 });
  } catch (error) {
    console.error('Error updating help request:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: error.status || 500 });
  }
}

export async function DELETE(req: NextRequest, { params }) {
  try {
    const { id } = params;
    const authFailed = await authenticate(req);
    if (authFailed) {
      return authFailed;
    }
    const user = req.user;

    const helpRequest = await prisma.helpRequest.findUnique({
      where: {
        id: Number(id)
      }
    });

    if (!helpRequest) {
      return NextResponse.json({ message: 'Help request not found' }, { status: 404 });
    }

    if (user.type !== ADMIN && helpRequest.userId !== user.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    await prisma.helpRequest.delete({
      where: {
        id: Number(id)
      }
    });

    return NextResponse.json({ message: 'Help request deleted' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting help request:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: error.status || 500 });
  }
}
