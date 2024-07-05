// src/app/api/ai-chat/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticate } from "../../middleware";
import { ADMIN } from "@/constant";

export async function GET(req: NextRequest, { params }) {
  try {
    const { id } = params;
    const authFailed = await authenticate(req);
    if (authFailed) {
      return authFailed;
    }

    const aiChat = await prisma.aIChat.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!aiChat) {
      return NextResponse.json(
        { message: "AI Chat not found" },
        { status: 404 }
      );
    }
    if (req.user.type !== ADMIN && req.user.id !== aiChat.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ aiChat }, { status: 200 });
  } catch (error) {
    console.error("Error getting AI Chat:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: error.status || 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }) {
  try {
    const { id } = params;
    const authFailed = await authenticate(req);
    if (authFailed) {
      return authFailed;
    }

    const { question, answer } = await req.json();
    const oldAIChat = await prisma.aIChat.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        userId: true,
      },
    });
    if (!oldAIChat) {
      return NextResponse.json(
        { message: "AI Chat not found" },
        { status: 404 }
      );
    }
    if (oldAIChat.userId !== req.user.id && req.user.type !== ADMIN) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const aiChat = await prisma.aIChat.update({
      where: {
        id: Number(id),
      },
      data: {
        question,
        answer,
        chatDate: new Date(),
      },
    });

    return NextResponse.json({ aiChat }, { status: 200 });
  } catch (error) {
    console.error("Error updating AI Chat:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: error.status || 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }) {
  try {
    const { id } = params;
    const authFailed = await authenticate(req);
    if (authFailed) {
      return authFailed;
    }

    const aiChat = await prisma.aIChat.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        userId: true,
      },
    });

    if (!aiChat) {
      return NextResponse.json(
        { message: "AI Chat not found" },
        { status: 404 }
      );
    }
    if (aiChat.userId !== req.user.id && req.user.type !== ADMIN) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await prisma.aIChat.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({ message: "AI Chat deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting AI Chat:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: error.status || 500 }
    );
  }
}
