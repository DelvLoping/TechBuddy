// src/app/api/address/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authenticate } from "../middleware";
import { ADMIN, HELPER, TECHBUDDY } from "@/app/constant";

export async function GET(req: NextRequest) {
  try {
    await authenticate(req);

    const user = req.user;

    let addresses;

    if (user.type === ADMIN) {
      addresses = await prisma.address.findMany();
    } else {
      addresses = await prisma.address.findMany({
        where: {
          OR: [
            {
              users: {
                some: {
                  id: user.id,
                },
              },
            },
            {
              requests: {
                some: {
                  userId: user.id,
                },
              },
            },
          ],
        },
      });
    }

    return NextResponse.json({ addresses }, { status: 200 });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
