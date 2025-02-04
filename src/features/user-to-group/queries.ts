import { db } from "@/db";
import { userTable, userToGroupTable } from "@/db/schema";
import { isArrayEmpty } from "@/lib/utils";

import { and, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const userToGroupKey = "userToGroup";

export const findGroupUsersByGroupId = unstable_cache(
  async (groupId: number) => {
    const rows = await db
      .select()
      .from(userToGroupTable)
      .innerJoin(userTable, eq(userToGroupTable.userId, userTable.id))
      .where(eq(userToGroupTable.groupId, groupId));

    return rows;
  },
  undefined,
  {
    tags: [userToGroupKey],
    revalidate: 60 * 60 * 24,
  }
);

export const findUserGroupsByUserId = unstable_cache(
  async (userId: number) => {
    const rows = await db
      .select()
      .from(userToGroupTable)
      .where(eq(userToGroupTable.userId, userId));

    return rows;
  },
  undefined,
  {
    tags: [userToGroupKey],
    revalidate: 60 * 60 * 24,
  }
);

export const findUserToGroupByUserIdAndGroupId = unstable_cache(
  async (userId: number, groupId: number) => {
    const rows = await db
      .select()
      .from(userToGroupTable)
      .where(
        and(
          eq(userToGroupTable.userId, userId),
          eq(userToGroupTable.groupId, groupId)
        )
      );

    if (isArrayEmpty(rows)) return null;

    return rows[0];
  },
  undefined,
  {
    tags: [userToGroupKey],
    revalidate: 60 * 60 * 24,
  }
);
