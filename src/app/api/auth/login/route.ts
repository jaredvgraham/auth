// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  createAccessToken,
  createRefreshToken,
  UserPayload,
} from "@/utils/jwt";
import bcrypt from "bcrypt";
import { findUserByEmail, addSession } from "@/models/userModel";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const user = await findUserByEmail(email);

  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    // Store the session in the database
    await addSession(user.id, refreshToken);

    const response = NextResponse.json({ accessToken });
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: "strict",
      path: "/",
    });

    return response;
  } else {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }
}
