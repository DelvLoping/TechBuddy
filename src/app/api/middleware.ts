// api/middleware.ts

import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

const validTokens = new Map<number, string>();

export async function verifyToken(req: NextRequest): Promise<boolean> {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return false;
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return false;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      userId: number;
    };

    if (
      !validTokens.has(decoded.userId) &&
      process.env.NODE_ENV !== "development"
    ) {
      return false;
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });
    if (!user) {
      return false;
    }

    req.user = user;

    return true;
  } catch (error) {
    console.log("Error verifying token:", error);
    console.error("Error verifying token:", error);
    return false;
  }
}
export function getValidTokens(id: number) {
  return validTokens.get(id);
}
export function addToValidTokens(id: number, token: string) {
  validTokens.set(id, token);
}

export function removeFromValidTokens(id: number) {
  validTokens.delete(id);
}

export const authenticate = async (req: NextRequest) => {
  const isAuthenticated = await verifyToken(req);
  console.log("isAuthenticated", isAuthenticated);
  if (!isAuthenticated) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
};
