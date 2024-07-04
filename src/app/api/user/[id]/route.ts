// src/app/api/user/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticate } from "../../middleware";
import { ADMIN } from "@/app/constant";

// model User {
//     id                  Int                 @id @default(autoincrement())
//     lastname            String
//     firstname           String
//     email               String              @unique
//     password            String
//     age                 Int?
//     addressId           Int?
//     type                UserType            @default(TECHBUDDY)
//     signupDate          DateTime            @default(now())
//     helpRequests        HelpRequest[]
//     applications        HelperApplication[]
//     chat1               Chat[]              @relation("User1Chats")
//     chat2               Chat[]              @relation("User2Chats")
//     messages            Message[]
//     evaluationsGiven    Evaluation[]        @relation("EvaluatorEvaluations")
//     evaluationsReceived Evaluation[]        @relation("EvaluateeEvaluations")
//     aiChats             AIChat[]
//     address             Address?            @relation(fields: [addressId], references: [id])
//   }
export async function GET(req: NextRequest, { params }) {
  try {
    const { id } = params;
    await authenticate(req);

    if (req.user.type !== ADMIN && req.user.id !== Number(id)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error getting user:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: error.status || 500 }
    );
  }
}
