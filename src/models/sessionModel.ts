import clientPromise from "@/utils/mongodb";
import { Collection } from "mongodb";

interface Session {
  userId: number;
  refreshToken: string;
  createdAt: Date;
}

const getSessionCollection = async (): Promise<Collection<Session>> => {
  const client = await clientPromise;
  const db = client.db();
  return db.collection<Session>("sessions");
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

export const deleteSessionByToken = async (
  refreshToken: string
): Promise<void> => {
  const sessions = await getSessionCollection();
  await sessions.deleteOne({ refreshToken });
};
