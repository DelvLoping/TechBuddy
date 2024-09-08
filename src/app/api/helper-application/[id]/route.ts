// src/app/api/help-application/[id]/route.ts

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

    const helpApplication = await prisma.helperApplication.findUnique({
      where: {
        id: Number(id)
      }
    });

    if (!helpApplication) {
      return NextResponse.json({ message: 'Helper application not found' }, { status: 404 });
    }
    if (req.user.type !== ADMIN && req.user.id !== helpApplication.helperId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ helpApplication }, { status: 200 });
  } catch (error: any) {
    console.error('Error getting helper application:', error);
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

    const { status } = await req.json();
    const oldHelpApplication = await prisma.helperApplication.findUnique({
      where: {
        id: Number(id)
      }
    });
    if (!oldHelpApplication) {
      return NextResponse.json({ message: 'Helper application not found' }, { status: 404 });
    }

    const helpRequest = await prisma.helpRequest.findUnique({
      where: {
        id: oldHelpApplication.requestId
      }
    });
    if (!helpRequest) {
      return NextResponse.json({ message: 'Help request not found' }, { status: 404 });
    }

    if (
      req.user.type === HELPER ||
      (req.user.type === TECHBUDDY && req.user.id !== helpRequest.userId)
    ) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (status === 'ACCEPTED') {
      const chat = await prisma.chat.create({
        data: {
          requestId: Number(helpRequest.id),
          user1Id: Number(helpRequest.userId),
          user2Id: Number(oldHelpApplication.helperId)
        }
      });
      await prisma.helpRequest.update({
        where: {
          id: Number(oldHelpApplication.requestId)
        },
        data: {
          status: 'IN_PROGRESS'
        }
      });

      if (!chat) {
        return NextResponse.json({ message: 'Error creating chat' }, { status: 500 });
      }
    }

    if (status !== 'ACCEPTED') {
      await prisma.chat.deleteMany({
        where: {
          requestId: helpRequest.id,
          user2Id: oldHelpApplication.helperId
        }
      });

      await prisma.helpRequest.update({
        where: {
          id: helpRequest.id
        },
        data: {
          status: 'OPEN'
        }
      });
    }

    const helpApplication = await prisma.helperApplication.update({
      where: {
        id: Number(id)
      },
      data: {
        status
      }
    });

    return NextResponse.json({ helpApplication }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating helper application:', error);
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

    const helpApplication = await prisma.helperApplication.findUnique({
      where: {
        id: Number(id)
      }
    });

    if (!helpApplication) {
      return NextResponse.json({ message: 'Helper application not found' }, { status: 404 });
    }

    if (
      req.user.type === TECHBUDDY ||
      (req.user.type === HELPER && req.user.id !== helpApplication.helperId)
    ) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await prisma.helperApplication.delete({
      where: {
        id: Number(id)
      }
    });

    return NextResponse.json({ message: 'Helper application deleted' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting helper application:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: error.status || 500 });
  }
}
