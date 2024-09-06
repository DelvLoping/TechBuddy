// src/app/api/help-request/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticate } from '../middleware';
import { ADMIN, IN_PERSON, VIRTUAL } from '@/constant';
import _ from 'lodash';

export async function GET(req: NextRequest) {
  try {
    const authFailed = await authenticate(req);
    if (authFailed) {
      return authFailed;
    }

    const user = req.user;
    const url = new URL(req.url);

    // Pagination
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    const skip = (page - 1) * pageSize;

    // Sorting
    const sortBy = url.searchParams.get('sortBy') || 'requestDate';
    const sortOrder = url.searchParams.get('sortOrder') === 'desc' ? 'desc' : 'asc';

    // Filtering
    const status = url.searchParams.get('status');
    const subject = url.searchParams.get('subject');
    const interventionType = url.searchParams.get('interventionType');
    const dateFrom = url.searchParams.get('dateFrom');
    const dateTo = url.searchParams.get('dateTo');

    const filters: any = {
      ...(status && { status }),
      ...(subject && { subject: { contains: subject } }),
      ...(interventionType && { interventionType }),
      ...(dateFrom && { requestDate: { gte: new Date(dateFrom) } }),
      ...(dateTo && { requestDate: { lte: new Date(dateTo) } })
    };

    let helpRequests;
    let totalRequests;

    if (user.type === ADMIN) {
      helpRequests = await prisma.helpRequest.findMany({
        where: filters,
        include: {
          interventionAddress: {
            select: {
              id: true,
              street: true,
              city: true,
              postalCode: true,
              country: true
            }
          }
        },
        skip,
        take: pageSize,
        orderBy: {
          [sortBy]: sortOrder
        }
      });
      totalRequests = await prisma.helpRequest.count({
        where: filters
      });
    } else {
      helpRequests = await prisma.helpRequest.findMany({
        where: {
          userId: user.id,
          ...filters
        },
        include: {
          interventionAddress: {
            select: {
              id: true,
              street: true,
              city: true,
              postalCode: true,
              country: true
            }
          }
        },

        skip,
        take: pageSize,
        orderBy: {
          [sortBy]: sortOrder
        }
      });
      totalRequests = await prisma.helpRequest.count({
        where: {
          userId: user.id,
          ...filters
        }
      });
    }

    const totalPages = Math.ceil(totalRequests / pageSize);

    return NextResponse.json(
      {
        helpRequests,
        pagination: {
          totalRequests,
          totalPages,
          currentPage: page
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching help requests:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: error.status || 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
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
      interventionAddress
    } = await req.json();
    const { city, postalCode, country, street } = interventionAddress || {};
    const user = req.user;
    const formattedInterventionDate = interventionDate
      ? new Date(interventionDate).toISOString()
      : undefined;

    if (!subject || !interventionType || !description) {
      return NextResponse.json(
        { message: 'Subject, description and intervention type are required' },
        { status: 400 }
      );
    }
    if (interventionType === VIRTUAL && !_.isEmpty(interventionAddress)) {
      return NextResponse.json(
        {
          message: 'Intervention address is not required for online intervention'
        },
        { status: 400 }
      );
    }
    let interventionAddressId;
    if (interventionType === IN_PERSON && !interventionAddress) {
      return NextResponse.json(
        {
          message: 'Intervention address is required for in-person intervention'
        },
        { status: 400 }
      );
    }
    if (interventionType === IN_PERSON) {
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

    const newHelpRequest = await prisma.helpRequest.create({
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
        user: {
          connect: {
            id: user.id
          }
        }
      }
    });

    return NextResponse.json({ helpRequest: newHelpRequest }, { status: 201 });
  } catch (error) {
    console.error('Error creating help request:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: error.status || 500 });
  }
}
