import { db } from "@/db";
import { groupSessionTable } from "@/db/schema";
import { isArrayEmpty } from "@/lib/utils";
import { Pagination } from "@/lib/pagination/types";
import { and, desc, eq, isNotNull, isNull } from "drizzle-orm";
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

export const findPassedGroupSessionsByGroupId = unstable_cache(
  async (groupId: number, pagination?: Pagination) => {
    const rows = await db
      .select()
      .from(groupSessionTable)
      .where(
        and(
          eq(groupSessionTable.groupId, groupId),
          isNotNull(groupSessionTable.endedAt)
        )
      )
      .orderBy(desc(groupSessionTable.startedAt))
      .limit(pagination?.limit ?? 30)
      .offset(pagination?.offset ?? 0);

    return rows;
  },
  undefined,
  {
    tags: [groupSessionsKey],
    revalidate: 60 * 5,
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
    revalidate: 60 * 5,
  }
);
