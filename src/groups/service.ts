"use server";

import { validateRequest } from "@/auth/service";
import { db } from "@/db";
import { userToGroupTable } from "@/db/schema";
import { DrizzleError, eq, sql } from "drizzle-orm";

export async function getMyGroups() {
  const { user } = await validateRequest();

  if (!user) throw new DrizzleError({ message: "Not authenticated" });

  const myGroups = await db.query.userToGroupTable.findMany({
    where: eq(userToGroupTable.userId, user.id),
    with: {
      group: true,
    },
    extras: {
      userCount: sql<number>`count(${userToGroupTable.userId})`.as(
        "user_count"
      ),
    },
  });

  return myGroups
    .filter((item) => !!item.groupId)
    .map((group) => ({
      group: group.group,
      userCount: group.userCount,
    }));
}
