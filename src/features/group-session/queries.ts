import { db } from "@/db";
import { groupSessionTable } from "@/db/schema";
import { isArrayEmpty } from "@/lib/utils";
import { and, eq, isNull } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const groupSessionsKey = "group-sessions";

export const findGroupSessionById = unstable_cache(
  async (id: number) => {
    const rows = await db
      .select()
      .from(groupSessionTable)
      .where(eq(groupSessionTable.id, id));

    if (isArrayEmpty(rows)) return null;

    return rows[0];
  },
  undefined,
  {
    tags: [groupSessionsKey],
  }
);

export const findActiveGroupSessionByGroupId = unstable_cache(
  async (groupId: number) => {
    const rows = await db
      .select()
      .from(groupSessionTable)
      .where(
        and(
          eq(groupSessionTable.groupId, groupId),
          isNull(groupSessionTable.endedAt)
        )
      );

    if (isArrayEmpty(rows)) return null;

    return rows[0];
  },
  undefined,
  {
    tags: [groupSessionsKey],
  }
);

export const findGroupSessionsByGroupId = unstable_cache(
  async (groupId: number) => {
    const rows = await db
      .select()
      .from(groupSessionTable)
      .where(eq(groupSessionTable.groupId, groupId));

    return rows;
  },
  undefined,
  {
    tags: [groupSessionsKey],
  }
);
