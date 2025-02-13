import { db } from "@/db";
import { groupTable, userToGroupTable } from "@/db/schema";
import { isArrayEmpty } from "@/lib/utils";
import { count, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const groupsKey = "groups";

export const findGroupById = unstable_cache(
  async (id: number) => {
    const rows = await db
      .select()
      .from(groupTable)
      .where(eq(groupTable.id, id))
      .limit(1);

    if (isArrayEmpty(rows)) return null;

    return rows[0];
  },
  undefined,
  {
    tags: [groupsKey],
  }
);

export const findGroupsByUserId = unstable_cache(
  async (userId: number) => {
    const rows = await db
      .select()
      .from(userToGroupTable)
      .where(eq(userToGroupTable.userId, userId))
      .innerJoin(groupTable, eq(groupTable.id, userToGroupTable.groupId));

    const groups = rows.map((row) => row.group);

    return groups;
  },
  undefined,
  {
    tags: [groupsKey],
  }
);

export const findOwnedGroupsCountByUserId = async (userId: number) => {
  const rows = await db
    .select({ count: count() })
    .from(groupTable)
    .where(eq(groupTable.ownerId, userId));

  if (isArrayEmpty(rows)) return 0;

  return rows[0].count;
};
