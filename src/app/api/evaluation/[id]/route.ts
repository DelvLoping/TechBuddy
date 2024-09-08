// src/app/api/evaluation/[id]/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticate } from '../../middleware';
import { NextRequestWithUser } from '../../type';
import { ADMIN, RATINGS } from '@/constant';

export async function GET(req: NextRequestWithUser, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const authFailed = await authenticate(req);
    if (authFailed) {
      return authFailed;
    }

    const evaluation = await prisma.evaluation.findUnique({
      where: {
        id: Number(id)
      }
    });

    if (!evaluation) {
      return NextResponse.json({ message: 'Evaluation not found' }, { status: 404 });
    }
    if (
      evaluation.evaluatorId !== req.user.id &&
      evaluation.evaluateeId !== req.user.id &&
      req.user.type !== ADMIN
    ) {
      return NextResponse.json(
        { message: 'You are not authorized to view this evaluation' },
        { status: 403 }
      );
    }

    return NextResponse.json({ evaluation }, { status: 200 });
  } catch (error: any) {
    console.error('Error getting evaluation:', error);
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

    const { rating, comment } = await req.json();
    const oldEvaluation = await prisma.evaluation.findUnique({
      where: {
        id: Number(id)
      },
      select: {
        evaluatorId: true
      }
    });
    if (!oldEvaluation) {
      return NextResponse.json({ message: 'Evaluation not found' }, { status: 404 });
    }
    if (oldEvaluation.evaluatorId !== req.user.id && req.user.type !== ADMIN) {
      return NextResponse.json(
        { message: 'You are not authorized to edit this evaluation' },
        { status: 403 }
      );
    }
    const evaluation = await prisma.evaluation.update({
      where: {
        id: Number(id)
      },
      data: {
        rating: rating,
        comment: comment
      }
    });

    return NextResponse.json({ evaluation }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating evaluation:', error);
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

    const evaluation = await prisma.evaluation.findUnique({
      where: {
        id: Number(id)
      },
      select: {
        evaluatorId: true
      }
    });

    if (!evaluation) {
      return NextResponse.json({ message: 'Evaluation not found' }, { status: 404 });
    }

    if (evaluation.evaluatorId !== req.user.id && req.user.type !== ADMIN) {
      return NextResponse.json(
        { message: 'You are not authorized to delete this evaluation' },
        { status: 403 }
      );
    }

    await prisma.evaluation.delete({
      where: {
        id: Number(id)
      }
    });

    return NextResponse.json({ message: 'Evaluation deleted' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting evaluation:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: error.status || 500 });
  }
}
