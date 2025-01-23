import { db } from "@/db";
import { deedStatusTable } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
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
    console.log("Getting Deed Statuses by template ids");

    const rows = await db
      .select()
      .from(deedStatusTable)
      .where(inArray(deedStatusTable.deedTemplateId, deedTemplateIds));

    return rows;
  },
  undefined,
  { tags: [deedStatusesKey] }
);
