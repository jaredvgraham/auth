import clientPromise from "@/utils/mongodb";
import { Collection } from "mongodb";

interface User {
  id: number;
  email: string;
  password: string;
  createdAt: Date;
}

const getUserCollection = async (): Promise<Collection<User>> => {
  const client = await clientPromise;
  const db = client.db();
  return db.collection<User>("users");
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const users = await getUserCollection();
  return users.findOne({ email });
};

export const addUser = async (user: User): Promise<void> => {
  const users = await getUserCollection();
  await users.insertOne(user);
};

export const findUserById = async (id: number): Promise<User | null> => {
  const users = await getUserCollection();
  return users.findOne({ id });
};
