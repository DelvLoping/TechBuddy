// src/app/api/ai-message/[id]/route.ts

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
    const user = req.user;

    const aIMessage = await prisma.aIMessage.findUnique({
      where: {
        id: Number(id),
      },
    });

    const aIChat = await prisma.aIChat.findUnique({
      where: {
        id: aIMessage?.aiChatId,
      },
      select: {
        userId: true,
      },
    });

    if (!aIMessage || !aIChat) {
      return NextResponse.json(
        { message: "aIMessages not found" },
        { status: 404 }
      );
    }

    if (aIChat.userId !== user.id && user.type !== ADMIN) {
      return NextResponse.json(
        { message: "You are not authorized to view this ai message" },
        { status: 403 }
      );
    }

    return NextResponse.json({ aIMessage }, { status: 200 });
  } catch (error) {
    console.error("Error fetching ai messages:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
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

    const { content } = await req.json();
    const user = req.user;

    if (!content) {
      return NextResponse.json(
        { message: "Content is required" },
        { status: 400 }
      );
    }

    const oldAIMessage = await prisma.aIMessage.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        aiChatId: true,
      },
    });

    const aIChat = await prisma.aIChat.findUnique({
      where: {
        id: oldAIMessage?.aiChatId,
      },
      select: {
        userId: true,
      },
    });

    if (!oldAIMessage || !aIChat) {
      return NextResponse.json(
        { message: "aIMessages not found" },
        { status: 404 }
      );
    }

    if (aIChat.userId !== user.id && user.type !== ADMIN) {
      return NextResponse.json(
        { message: "You are not authorized to edit this ai message" },
        { status: 403 }
      );
    }

    const aIMessage = await prisma.aIMessage.update({
      where: {
        id: Number(id),
      },
      data: {
        content,
      },
    });

    return NextResponse.json({ aIMessage }, { status: 200 });
  } catch (error) {
    console.error("Error creating ai message:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
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

    const user = req.user;

    const oldAIMessage = await prisma.aIMessage.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        aiChatId: true,
      },
    });

    const aIChat = await prisma.aIChat.findUnique({
      where: {
        id: oldAIMessage?.aiChatId,
      },
      select: {
        userId: true,
      },
    });

    if (!oldAIMessage || !aIChat) {
      return NextResponse.json(
        { message: "aIMessages not found" },
        { status: 404 }
      );
    }

    if (aIChat.userId !== user.id && user.type !== ADMIN) {
      return NextResponse.json(
        { message: "You are not authorized to delete this ai message" },
        { status: 403 }
      );
    }

    await prisma.aIMessage.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({ message: "aIMessage deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting ai message:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}