// src/app/api/evaluation/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticate } from "../middleware";
import { NextRequestWithUser } from "../type";
import { ADMIN, RATINGS } from "@/constant";

export async function GET(req: NextRequestWithUser) {
  try {
    const authFailed = await authenticate(req);
    if (authFailed) {
      return authFailed;
    }
    const user = req.user;

    let evaluations;

    if (user.type === ADMIN) {
      evaluations = await prisma.evaluation.findMany();
    } else {
      evaluations = await prisma.evaluation.findMany({
        where: {
          OR: [
            {
              evaluatorId: user.id,
            },
            {
              evaluateeId: user.id,
            },
          ],
        },
      });
    }

    return NextResponse.json({ evaluations }, { status: 200 });
  } catch (error) {
    console.error("Error fetching evaluations:", error);
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

    const { requestId, evaluateeId, rating, comment } = await req.json();
    const user = req.user;

    if (!requestId || !evaluateeId || !rating) {
      return NextResponse.json(
        { message: "Request ID, evaluatee ID and rating are required" },
        { status: 400 }
      );
    }
    if (!RATINGS[rating]) {
      return NextResponse.json({ message: "Invalid rating" }, { status: 400 });
    }
    if (user.id === Number(evaluateeId)) {
      return NextResponse.json(
        { message: "You can't evaluate yourself" },
        { status: 400 }
      );
    }

    const evaluation = await prisma.evaluation.create({
      data: {
        requestId: Number(requestId),
        evaluatorId: user.id,
        evaluateeId: Number(evaluateeId),
        rating: rating,
        comment,
      },
    });

    return NextResponse.json({ evaluation }, { status: 201 });
  } catch (error) {
    console.error("Error creating evaluation:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
