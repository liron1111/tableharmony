import "server-only";

import { db } from "@/db";
import { users } from "@/db/schema";

import type { CreateUserDto } from "../types";

export async function createUser(user: CreateUserDto): Promise<void> {
  await db.insert(users).values(user);
}