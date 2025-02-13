import { db } from "@/db";
import { deedStatusTable } from "@/db/schema";
import { count, eq, inArray } from "drizzle-orm";
import { isArrayEmpty } from "@/lib/utils";
import { unstable_cache } from "next/cache";

export const deedStatusesKey = "deedStatuses";

export const findDeedStatusesByTemplateId = unstable_cache(
  async (deedTemplateId: number) => {
    const rows = await db
      .select()
      .from(deedStatusTable)
      .where(eq(deedStatusTable.deedTemplateId, deedTemplateId));

    return rows;
  },
  undefined,
  {
    tags: [deedStatusesKey],
  }
);

export const findDeedStatusesByTemplateIds = unstable_cache(
  async (deedTemplateIds: number[]) => {
    const rows = await db
      .select()
      .from(deedStatusTable)
      .where(inArray(deedStatusTable.deedTemplateId, deedTemplateIds));

    return rows;
  },
  undefined,
  { tags: [deedStatusesKey] }
);

export const findDeedStatusesCountByTemplateId = async (
  deedTemplateId: number
) => {
  const rows = await db
    .select({ count: count() })
    .from(deedStatusTable)
    .where(eq(deedStatusTable.deedTemplateId, deedTemplateId));

  if (isArrayEmpty(rows)) return 0;

  return rows[0].count;
};
