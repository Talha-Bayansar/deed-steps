import { db } from "@/db";
import { sessionTable, userTable, userToGroupTable } from "@/db/schema";
import { isArrayEmpty } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const usersKey = "users";
export const currentUserKey = "currentUser";

export const findUserBySessionId = unstable_cache(
  async (sessionId: string) => {
    const rows = await db
      .select({ user: userTable, session: sessionTable })
      .from(sessionTable)
      .innerJoin(userTable, eq(sessionTable.userId, userTable.id))
      .where(eq(sessionTable.id, sessionId));

    if (isArrayEmpty(rows)) return null;

    return rows[0];
  },
  undefined,
  {
    tags: [currentUserKey],
  }
);

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
