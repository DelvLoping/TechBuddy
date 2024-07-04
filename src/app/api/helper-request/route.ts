// src/app/api/helpRequest/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticate } from "../middleware";
import { ADMIN, IN_PERSON, VIRTUAL } from "@/app/constant";

export async function GET(req: NextRequest) {
  try {
    await authenticate(req);

    const user = req.user;

    let helpRequests;

    if (user.type === ADMIN) {
      helpRequests = await prisma.helpRequest.findMany();
    } else {
      helpRequests = await prisma.helpRequest.findMany({
        where: {
          userId: user.id,
        },
      });
    }

    return NextResponse.json({ helpRequests }, { status: 200 });
  } catch (error) {
    console.error("Error fetching help requests:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: error.status || 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await authenticate(req);

    const {
      subject,
      description,
      interventionType,
      reward,
      interventionDate,
      interventionAddress,
    } = await req.json();
    const { city, postalCode, country, street } = interventionAddress || {};
    const user = req.user;
    const formattedInterventionDate = interventionDate
      ? new Date(interventionDate).toISOString()
      : undefined;

    if (!subject || !interventionType || !description) {
      return NextResponse.json(
        { message: "Subject, description and intervention type are required" },
        { status: 400 }
      );
    }
    if (interventionType === VIRTUAL && interventionAddress) {
      return NextResponse.json(
        {
          message:
            "Intervention address is not required for online intervention",
        },
        { status: 400 }
      );
    }
    let interventionAddressId;
    if (interventionType === IN_PERSON && !interventionAddress) {
      return NextResponse.json(
        {
          message:
            "Intervention address is required for in-person intervention",
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
            country,
          },
        });

        interventionAddressId = createdAddress.id;
      } catch (error) {
        console.error("Error creating address:", error);
        throw new Error("Failed to create address");
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
                id: interventionAddressId,
              },
            }
          : undefined,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return NextResponse.json({ helpRequest: newHelpRequest }, { status: 201 });
  } catch (error) {
    console.error("Error creating help request:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: error.status || 500 }
    );
  }
}
