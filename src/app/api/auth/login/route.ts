// app/api/auth/login/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { addToValidTokens, getValidTokens } from "../../middleware";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    }

    let token = getValidTokens(user.id);

    if (!token) {
      token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "10d",
      });
      addToValidTokens(user.id, token);
    }

    const connectedUser = req.user;
    return NextResponse.json({ token, connectedUser }, { status: 200 });
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
