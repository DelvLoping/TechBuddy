// src/app/api/help-request/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticate } from "../../middleware";
import { ADMIN } from "@/app/constant";

export async function GET(req: NextRequest, { params }) {
  try {
    const { id } = params;
    await authenticate(req);

    const helpRequest = await prisma.helpRequest.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        user: {
          select: {
            id: true,
          },
        },
        interventionAddress: {
          select: {
            id: true,
            street: true,
            city: true,
            postalCode: true,
            country: true,
          },
        },
      },
    });

    if (!helpRequest) {
      return NextResponse.json(
        { message: "Help request not found" },
        { status: 404 }
      );
    }
    if (req.user.type !== ADMIN && helpRequest.userId !== req.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json({ helpRequest }, { status: 200 });
  } catch (error) {
    console.error("Error getting help request:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: error.status || 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }) {
  try {
    const { id } = params;
    await authenticate(req);

    const {
      subject,
      description,
      interventionType,
      reward,
      interventionDate,
      interventionAddress,
      status,
    } = await req.json();
    const { city, postalCode, country, street } = interventionAddress || {};

    const user = req.user;

    const formattedInterventionDate = interventionDate
      ? new Date(interventionDate).toISOString()
      : undefined;
    console.log(id);
    const helpRequest = await prisma.helpRequest.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!helpRequest) {
      return NextResponse.json(
        { message: "Help request not found" },
        { status: 404 }
      );
    }

    if (user.type !== ADMIN && helpRequest.userId !== user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    let interventionAddressId;
    if (interventionAddress) {
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

    const updatedHelpRequest = await prisma.helpRequest.update({
      where: {
        id: Number(id),
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
                id: interventionAddressId,
              },
            }
          : undefined,
        status,
      },
    });

    return NextResponse.json(
      { helpRequest: updatedHelpRequest },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating help request:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: error.status || 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }) {
  try {
    const { id } = params;
    await authenticate(req);
    const user = req.user;

    const helpRequest = await prisma.helpRequest.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!helpRequest) {
      return NextResponse.json(
        { message: "Help request not found" },
        { status: 404 }
      );
    }

    if (user.type !== ADMIN && helpRequest.userId !== user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    await prisma.helpRequest.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json(
      { message: "Help request deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting help request:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: error.status || 500 }
    );
  }
}
