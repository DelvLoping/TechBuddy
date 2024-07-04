// src/app/api/message/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticate } from "../../middleware";
import { ADMIN } from "@/app/constant";

export async function GET(req: NextRequest, { params }) {
  try {
    const { id } = params;
    await authenticate(req);

    const message = await prisma.message.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!message) {
      return NextResponse.json(
        { message: "Messages not found" },
        { status: 404 }
      );
    }

    if (message.userId !== req.user.id && req.user.type !== ADMIN) {
      return NextResponse.json(
        { message: "You are not authorized to view this message" },
        { status: 403 }
      );
    }

    return NextResponse.json({ message }, { status: 200 });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }) {
  try {
    const { id } = params;
    await authenticate(req);

    const { content } = await req.json();
    const user = req.user;

    if (!content) {
      return NextResponse.json(
        { message: "Content is required" },
        { status: 400 }
      );
    }

    const oldMessage = await prisma.message.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        userId: true,
      },
    });
    if (!oldMessage) {
      return NextResponse.json(
        { message: "Message not found" },
        { status: 404 }
      );
    }

    if (oldMessage.userId !== user.id && user.type !== ADMIN) {
      return NextResponse.json(
        { message: "You are not authorized to edit this message" },
        { status: 403 }
      );
    }

    const message = await prisma.message.create({
      data: {
        chatId: Number(id),
        userId: user.id,
        content,
      },
    });

    return NextResponse.json({ message }, { status: 200 });
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }) {
  try {
    const { id } = params;
    await authenticate(req);

    const user = req.user;

    const message = await prisma.message.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        userId: true,
      },
    });

    if (!message) {
      return NextResponse.json(
        { message: "Message not found" },
        { status: 404 }
      );
    }

    if (message.userId !== user.id && user.type !== ADMIN) {
      return NextResponse.json(
        { message: "You are not authorized to delete this message" },
        { status: 403 }
      );
    }

    await prisma.message.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({ message: "Message deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
