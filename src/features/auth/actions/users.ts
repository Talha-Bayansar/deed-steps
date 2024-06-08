"use server";
import { db } from "@/db";
import { userTable } from "@/db/schema";
import { DrizzleError, eq } from "drizzle-orm";
import type { UserInsert } from "../models";
import { type Nullable } from "@/lib/utils";
import { validateRequest } from "./auth";

export async function updateUser(userDto: Nullable<UserInsert, "email">) {
  const { user } = await validateRequest();

  if (!user)
    throw new DrizzleError({
      message: "Not authenticated",
    });

  const updatedUser = await db
    .update(userTable)
    .set(userDto)
    .where(eq(userTable.id, user.id));

  return true;
}
