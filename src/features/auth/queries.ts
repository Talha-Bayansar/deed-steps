import { db } from "@/db";
import { userTable, userToGroupTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const usersKey = "users";

export const findUsersByGroupId = unstable_cache(
  async (groupId: number) => {
    const rows = await db
      .select({
        user: userTable,
      })
      .from(userToGroupTable)
      .innerJoin(userTable, eq(userToGroupTable.userId, userTable.id))
      .where(eq(userToGroupTable.groupId, groupId));

    return rows.map((row) => row.user);
  },
  undefined,
  {
    tags: [usersKey],
  }
);
