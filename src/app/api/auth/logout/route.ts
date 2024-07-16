import { NextRequest, NextResponse } from "next/server";
import authMiddleware from "@/middleware/auth";

const handler = async (req: NextRequest, res: NextResponse) => {
  const response = NextResponse.json({ message: "Logged out" });
  response.cookies.set("refreshToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    maxAge: 0,
    sameSite: "strict",
  });
  return response;
};

export const POST = authMiddleware(handler);
