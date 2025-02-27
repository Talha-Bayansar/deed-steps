import { db } from "@/db";
import { transactionTable, userTable } from "@/db/schema";
import { Pagination } from "@/lib/pagination/types";
import { desc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const transactionKey = "transactionKey";

export const findTransactionsByGroupId = unstable_cache(
  async (groupId: number, pagination?: Pagination) => {
    const rows = await db
      .select()
      .from(transactionTable)
      .innerJoin(userTable, eq(transactionTable.userId, userTable.id))
      .where(eq(transactionTable.groupId, groupId))
      .orderBy(desc(transactionTable.createdAt))
      .limit(pagination?.limit ?? 20)
      .offset(pagination?.offset ?? 0);

    return rows;
  },
  undefined,
  { tags: [transactionKey], revalidate: 60 * 5 }
);
