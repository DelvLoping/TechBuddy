// src/app/api/help-request/[id]/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticate } from '../../middleware';
import { NextRequestWithUser } from '../../type';
import { ADMIN } from '@/constant';
import _ from 'lodash';

// model HelpRequest {
//   id                    Int                 @id @default(autoincrement())
//   userId                Int
//   subject               String
//   description           String
//   requestDate           DateTime            @default(now())
//   interventionDate      DateTime?
//   interventionType      InterventionType
//   reward                String?
//   interventionAddressId Int?
//   status                RequestStatus       @default(OPEN)
//   user                  User                @relation(fields: [userId], references: [id], onDelete: Cascade)
//   applications          HelperApplication[]
//   chats                 Chat[]
//   evaluations           Evaluation[]
//   interventionAddress   Address?            @relation(fields: [interventionAddressId], references: [id])
// }

// model HelperApplication {
//   id              Int               @id @default(autoincrement())
//   requestId       Int
//   helperId        Int
//   applicationDate DateTime          @default(now())
//   status          ApplicationStatus @default(PROPOSED)
//   helpRequest     HelpRequest       @relation(fields: [requestId], references: [id], onDelete: Cascade)
//   helper          User              @relation(fields: [helperId], references: [id], onDelete: Cascade)
// }

export async function GET(req: NextRequestWithUser, { params }: { params: { id: string } }) {
  try {
    const authFailed = await authenticate(req);
    if (authFailed) {
      return authFailed;
    }

    const user = req.user;
    const url = new URL(req.url);

    let filters: any = {};
    if (user) {
      if (user.type !== 'TECHBUDDY') {
        filters = {
          applications: { some: { helperId: user.id } }
        };
      } else {
        filters = {
          userId: user.id
        };
      }
    }

    const helpRequests = await prisma.helpRequest.findMany({
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
      }
    });

    return NextResponse.json(
      {
        helpRequests
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching help requests:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: error.status || 500 });
  }
}
