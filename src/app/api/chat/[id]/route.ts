// src/app/api/chat/[id]/route.ts

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

    const chat = await prisma.chat.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!chat) {
      return NextResponse.json({ message: "Chat not found" }, { status: 404 });
    }
    if (
      req.user.type !== ADMIN &&
      req.user.id !== chat.user1Id &&
      req.user.id !== chat.user2Id
    ) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ chat }, { status: 200 });
  } catch (error) {
    console.error("Error getting chat:", error);
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

    const { message } = await req.json();
    const oldChat = await prisma.chat.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!oldChat) {
      return NextResponse.json({ message: "Chat not found" }, { status: 404 });
    }
    if (req.user.id !== oldChat.user1Id && req.user.id !== oldChat.user2Id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const chat = await prisma.chat.update({
      where: {
        id: Number(id),
      },
      data: {
        messages: {
          create: {
            userId: req.user.id,
            content: message,
          },
        },
      },
    });

    return NextResponse.json({ chat }, { status: 200 });
  } catch (error) {
    console.error("Error sending message:", error);
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

    const chat = await prisma.chat.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!chat) {
      return NextResponse.json({ message: "Chat not found" }, { status: 404 });
    }

    if (req.user.type !== ADMIN) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await prisma.chat.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({ message: "Chat deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting chat:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: error.status || 500 }
    );
  }
}
