import { db } from "@/db";
import { deedTemplateTable } from "@/db/schema";
import { isArrayEmpty } from "@/lib/utils";
import { eq, inArray } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const deedTemplatesKey = "deedTemplates";

export const findDeedTemplateById = unstable_cache(
  async (id: number) => {
    const rows = await db
      .select()
      .from(deedTemplateTable)
      .where(eq(deedTemplateTable.id, id))
      .limit(1);

    if (isArrayEmpty(rows)) return null;

    return rows[0];
  },
  undefined,
  {
    tags: [deedTemplatesKey],
  }
);

export const findDeedTemplatesByGroupId = unstable_cache(
  async (groupId: number) => {
    const rows = await db
      .select()
      .from(deedTemplateTable)
      .where(eq(deedTemplateTable.groupId, groupId));

    return rows;
  },
  undefined,
  { tags: [deedTemplatesKey] }
);

export const findDeedTemplatesByGroupIds = unstable_cache(
  async (groupIds: number[]) => {
    console.log("Getting deed templates by groupIds");

    const rows = await db
      .select()
      .from(deedTemplateTable)
      .where(inArray(deedTemplateTable.groupId, groupIds));

    return rows;
  },
  undefined,
  {
    tags: [deedTemplatesKey],
  }
);
