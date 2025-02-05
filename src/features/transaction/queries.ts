import { db } from "@/db";
import { transactionTable, userTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const transactionKey = "transactionKey";

export const findTransactionsByGroupId = unstable_cache(
  async (groupId: number) => {
    const rows = await db
      .select()
      .from(transactionTable)
      .innerJoin(userTable, eq(transactionTable.userId, userTable.id))
      .where(eq(transactionTable.groupId, groupId));

    return rows;
  },
  undefined,
  { tags: [transactionKey] }
);
