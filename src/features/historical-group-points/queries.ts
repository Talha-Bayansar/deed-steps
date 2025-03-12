import { db } from "@/db";
import { historicalGroupPointsTable, userTable } from "@/db/schema";
import { Pagination } from "@/lib/pagination/types";
import { asc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const historicalGroupPointsKey = "historical-group-points";

export const findHistoricalGroupPointsByGroupSessionId = unstable_cache(
  async (groupSessionId: number, pagination?: Pagination) => {
    const rows = await db
      .select()
      .from(historicalGroupPointsTable)
      .where(eq(historicalGroupPointsTable.groupSessionId, groupSessionId))
      .innerJoin(userTable, eq(historicalGroupPointsTable.userId, userTable.id))
      .orderBy(asc(userTable.firstName))
      .limit(pagination?.limit ?? 30)
      .offset(pagination?.offset ?? 0);

    return rows;
  },
  undefined,
  { tags: [historicalGroupPointsKey], revalidate: 60 * 3 }
);
