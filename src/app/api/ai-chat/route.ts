// src/app/api/ai-chat/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticate } from "../middleware";
import { NextRequestWithUser } from "../type";
import { ADMIN } from "@/constant";

export async function GET(req: NextRequestWithUser) {
  try {
    const authFailed = await authenticate(req);
    if (authFailed) {
      return authFailed;
    }
    const user = req.user;

    let aiChats;

    if (user.type === ADMIN) {
      aiChats = await prisma.aIChat.findMany();
    } else {
      aiChats = await prisma.aIChat.findMany({
        where: {
          userId: user.id,
        },
      });
    }

    return NextResponse.json({ aiChats }, { status: 200 });
  } catch (error) {
    console.error("Error fetching AI chats:", error);
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

    const { question, answer } = await req.json();
    const user = req.user;

    if (!question || !answer) {
      return NextResponse.json(
        { message: "Question and answer are required" },
        { status: 400 }
      );
    }

    const aiChat = await prisma.aIChat.create({
      data: {
        userId: user.id,
        question,
        answer,
      },
    });

    return NextResponse.json({ aiChat }, { status: 201 });
  } catch (error) {
    console.error("Error creating AI chat:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
