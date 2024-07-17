// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  createAccessToken,
  createRefreshToken,
  UserTokenPayload,
} from "@/utils/jwt";
import bcrypt from "bcrypt";
import cookie from "cookie";
import { addUser, findUserByEmail } from "@/models/userModel";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return NextResponse.json(
      { message: "User already exists" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user: UserTokenPayload = { id: Date.now(), email };

  await addUser({ ...user, password: hashedPassword, createdAt: new Date() });

  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  const response = NextResponse.json({ accessToken });
  response.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    sameSite: "strict",
    path: "/",
  });

  return response;
}
