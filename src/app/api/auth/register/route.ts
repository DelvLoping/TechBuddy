// app/api/auth/register/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { addToValidTokens } from "@/app/api/middleware";

export async function POST(req: NextRequest) {
  try {
    const { email, password, firstname, lastname, age, address, type } =
      await req.json();
    const { street, city, postalCode, country } = address || {};

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    let addressId = undefined;
    if (address && type === "HELPER") {
      addressId = await prisma.address.create({
        data: {
          street,
          city,
          postalCode,
          country,
        },
      })?.id;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstname,
        lastname,
        age,
        type,
        address: addressId,
      },
    });

    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "10d",
    });

    addToValidTokens(newUser.id, token);

    return NextResponse.json(
      { message: "User created", user: newUser, token },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function ALL(req: NextRequest) {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
