// app/api/auth/login/route.ts

import { NextRequest, NextResponse } from "next/server";
import {
  authenticate,
  removeFromValidTokens,
  verifyToken,
} from "../../middleware";

export async function GET(req: NextRequest) {
  try {
    const authFailed = await authenticate(req);
    if (authFailed) {
      return authFailed;
    }
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
