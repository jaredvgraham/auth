// models/userModel.ts
import clientPromise from "@/utils/mongodb";
import { Collection, Db } from "mongodb";

interface User {
  id: number;
  email: string;
  password: string;
}

interface Session {
  userId: number;
  refreshToken: string;
  createdAt: Date;
}

const getUserCollection = async (): Promise<Collection<User>> => {
  const client = await clientPromise;
  const db = client.db();
  return db.collection<User>("users");
};

const getSessionCollection = async (): Promise<Collection<Session>> => {
  const client = await clientPromise;
  const db = client.db();
  return db.collection<Session>("sessions");
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const users = await getUserCollection();
  return users.findOne({ email });
};

export const addUser = async (user: User): Promise<void> => {
  const users = await getUserCollection();
  await users.insertOne(user);
};

export const addSession = async (
  userId: number,
  refreshToken: string
): Promise<void> => {
  const sessions = await getSessionCollection();
  await sessions.insertOne({
    userId,
    refreshToken,
    createdAt: new Date(),
  });
};

export const findSessionByToken = async (
  refreshToken: string
): Promise<Session | null> => {
  const sessions = await getSessionCollection();
  return sessions.findOne({ refreshToken });
};

export const findUserById = async (id: number): Promise<User | null> => {
  const users = await getUserCollection();
  return users.findOne({ id });
};
