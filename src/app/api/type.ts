import { User } from "@prisma/client";
import { NextRequest } from "next/server";
export type NextRequestWithUser = NextRequest & { user: User };
