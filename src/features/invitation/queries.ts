import { db } from "@/db";
import { groupTable, invitationTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const invitationsKey = "invitations";

export const findInvitationsByUserId = async (userId: number) => {
  const rows = await db
    .select()
    .from(invitationTable)
    .innerJoin(groupTable, eq(invitationTable.groupId, groupTable.id))
    .where(eq(invitationTable.userId, userId));

  return rows;
};
