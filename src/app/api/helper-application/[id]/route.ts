// src/app/api/help-application/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticate } from "../../middleware";
import { ADMIN, HELPER, TECHBUDDY } from "@/app/constant";

export async function GET(req: NextRequest, { params }) {
  try {
    const { id } = params;
    await authenticate(req);

    const helpApplication = await prisma.helperApplication.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!helpApplication) {
      return NextResponse.json(
        { message: "Helper application not found" },
        { status: 404 }
      );
    }

    if (req.user.type !== ADMIN && req.user.id !== helpApplication.helperId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ helpApplication }, { status: 200 });
  } catch (error) {
    console.error("Error getting helper application:", error);
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

    const { status } = await req.json();
    const oldHelpApplication = await prisma.helperApplication.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!oldHelpApplication) {
      return NextResponse.json(
        { message: "Helper application not found" },
        { status: 404 }
      );
    }

    const helpRequest = await prisma.helpRequest.findUnique({
      where: {
        id: oldHelpApplication.requestId,
      },
    });
    if (!helpRequest) {
      return NextResponse.json(
        { message: "Help request not found" },
        { status: 404 }
      );
    }

    if (
      req.user.type === HELPER ||
      (req.user.type === TECHBUDDY && req.user.id !== helpRequest.userId)
    ) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const helpApplication = await prisma.helperApplication.update({
      where: {
        id: Number(id),
      },
      data: {
        status,
      },
    });

    return NextResponse.json({ helpApplication }, { status: 200 });
  } catch (error) {
    console.error("Error updating helper application:", error);
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

    const helpApplication = await prisma.helperApplication.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!helpApplication) {
      return NextResponse.json(
        { message: "Helper application not found" },
        { status: 404 }
      );
    }

    if (
      req.user.type === TECHBUDDY ||
      (req.user.type === HELPER && req.user.id !== helpApplication.helperId)
    ) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await prisma.helperApplication.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json(
      { message: "Helper application deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting helper application:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: error.status || 500 }
    );
  }
}
