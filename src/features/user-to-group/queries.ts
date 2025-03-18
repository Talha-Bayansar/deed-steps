import { db } from "@/db";
import { userTable, userToGroupTable, groupPointsTable } from "@/db/schema";
import { Pagination } from "@/lib/pagination/types";
import { isArrayEmpty } from "@/lib/utils";

import { and, asc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const userToGroupKey = "userToGroup";

export const findGroupUserDetailsByGroupId = unstable_cache(
  async (groupId: number, pagination?: Pagination) => {
    const rows = await db
      .select()
      .from(userToGroupTable)
      .innerJoin(userTable, eq(userToGroupTable.userId, userTable.id))
      .innerJoin(
        groupPointsTable,
        and(
          eq(groupPointsTable.userId, userToGroupTable.userId),
          eq(groupPointsTable.groupId, userToGroupTable.groupId)
        )
      )
      .where(eq(userToGroupTable.groupId, groupId))
      .orderBy(asc(userTable.firstName))
      .limit(pagination?.limit ?? 20)
      .offset(pagination?.offset ?? 0);

    return rows;
  },
  undefined,
  {
    tags: [userToGroupKey],
    revalidate: 60 * 3,
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
    revalidate: 60 * 3,
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
    revalidate: 60 * 3,
  }
);
