// src/app/api/auth/session/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyRefreshToken, createAccessToken } from "@/utils/jwt";
import { findSessionByToken } from "@/models/userModel";
import cookie from "cookie";

export async function GET(req: NextRequest) {
  const cookies = cookie.parse(req.headers.get("cookie") || "");
  if (!cookies.refreshToken) {
    return NextResponse.json(
      { message: "No refresh token provided" },
      { status: 401 }
    );
  }

  try {
    const decoded = verifyRefreshToken(cookies.refreshToken);
    const session = await findSessionByToken(cookies.refreshToken);
    if (!session) {
      return NextResponse.json({ message: "Invalid session" }, { status: 401 });
    }

    const accessToken = createAccessToken(decoded);
    return NextResponse.json({ accessToken });
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid refresh token" },
      { status: 401 }
    );
  }
}
