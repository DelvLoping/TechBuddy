// src/app/api/help-application/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticate } from "../middleware";
import { NextRequestWithUser } from "../type";
import { ADMIN, TECHBUDDY } from "@/constant";

export async function GET(req: NextRequestWithUser) {
  try {
    const authFailed = await authenticate(req);
    if (authFailed) {
      return authFailed;
    }
    const user = req.user;

    let helpApplications;
    if (user.type === ADMIN) {
      helpApplications = await prisma.helperApplication.findMany();
    } else if (user.type === TECHBUDDY) {
      const helpRequests = await prisma.helpRequest.findMany({
        where: {
          userId: user.id,
        },
      });
      const helpRequestIds = helpRequests.map((helpRequest) => helpRequest.id);
      helpApplications = await prisma.helperApplication.findMany({
        where: {
          requestId: {
            in: helpRequestIds,
          },
        },
      });
    } else {
      helpApplications = await prisma.helperApplication.findMany({
        where: {
          helperId: user.id,
        },
      });
    }

    return NextResponse.json({ helpApplications }, { status: 200 });
  } catch (error) {
    console.error("Error fetching helper applications:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequestWithUser) {
  try {
    const authFailed = await authenticate(req);
    if (authFailed) {
      return authFailed;
    }

    const { requestId } = await req.json();
    const user = req.user;

    if (!requestId) {
      return NextResponse.json(
        { message: "Request ID is required" },
        { status: 400 }
      );
    }

    if (user.type === TECHBUDDY) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const helpApplication = await prisma.helperApplication.create({
      data: {
        requestId: Number(requestId),
        helperId: user.id,
      },
    });

    return NextResponse.json({ helpApplication }, { status: 201 });
  } catch (error) {
    console.error("Error creating helper application:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
