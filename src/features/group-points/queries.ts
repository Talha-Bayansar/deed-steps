import { db } from "@/db";
import { groupPointsTable } from "@/db/schema";
import { isArrayEmpty } from "@/lib/utils";
import { and, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const groupPointsKey = "groupPoints";

export const findGroupPointsByUserIdAndGroupId = async (
  userId: number,
  groupId: number
) => {
  const rows = await db
    .select()
    .from(groupPointsTable)
    .where(
      and(
        eq(groupPointsTable.groupId, groupId),
        eq(groupPointsTable.userId, userId)
      )
    )
    .limit(1);

  if (isArrayEmpty(rows)) return null;

  return rows[0];
};

export const findGroupPointsByGroupId = unstable_cache(
  async (groupId: number) => {
    const rows = await db
      .select()
      .from(groupPointsTable)
      .where(eq(groupPointsTable.groupId, groupId));

    return rows;
  },
  undefined,
  {
    tags: [groupPointsKey],
  }
);
