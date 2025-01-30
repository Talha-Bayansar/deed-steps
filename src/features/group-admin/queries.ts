import { db } from "@/db";
import { groupAdminTable } from "@/db/schema";

import { eq } from "drizzle-orm";

export const groupAdminsKey = "groupAdmins";

export const findGroupAdminsByGroupId = async (groupId: number) => {
  const rows = await db
    .select()
    .from(groupAdminTable)
    .where(eq(groupAdminTable.groupId, groupId));

  return rows;
};

export const findGroupAdminsByUserId = async (userId: number) => {
  const rows = await db
    .select()
    .from(groupAdminTable)
    .where(eq(groupAdminTable.userId, userId));

  return rows;
};
