// app/api/auth/login/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { removeFromValidTokens, verifyToken } from "../../middleware";

export async function GET(req: NextRequest) {
  try {
    const isAuthenticated = await verifyToken(req);
    const userId = req.user?.id;
    if (userId) {
      removeFromValidTokens(userId);
      return NextResponse.json({ message: "User logged out" }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  } catch (error) {
    console.error("Error during logout:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
