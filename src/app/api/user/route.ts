// src/app/api/user/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticate } from "../middleware";
import { ADMIN } from "@/app/constant";

export async function GET(req: NextRequest) {
  try {
    await authenticate(req);
    const user = req.user;

    let users;

    if (user.type === ADMIN) {
      users = await prisma.user.findMany();
    } else {
      users = await prisma.user.findMany({
        where: {
          id: user.id,
        },
      });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
