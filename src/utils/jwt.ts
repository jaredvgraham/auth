// utils/jwt.ts
import jwt, { JwtPayload } from "jsonwebtoken";

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string;
const accessTokenExpiry = "1m"; // Adjust the expiry as needed
const refreshTokenExpiry = "7d"; // Adjust the expiry as needed

export interface UserPayload {
  id: number;
  email: string;
}

export const createAccessToken = (user: UserPayload): string => {
  return jwt.sign({ id: user.id, email: user.email }, accessTokenSecret, {
    expiresIn: accessTokenExpiry,
  });
};

export const createRefreshToken = (user: UserPayload): string => {
  return jwt.sign({ id: user.id, email: user.email }, refreshTokenSecret, {
    expiresIn: refreshTokenExpiry,
  });
};

export const verifyAccessToken = (token: string): UserPayload => {
  return jwt.verify(token, accessTokenSecret) as UserPayload;
};

export const verifyRefreshToken = (token: string): UserPayload => {
  return jwt.verify(token, refreshTokenSecret) as UserPayload;
};
