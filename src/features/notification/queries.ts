import { db } from "@/db";
import { pushSubscriptionTable } from "@/db/schema";
import { isArrayEmpty } from "@/lib/utils";
import { eq } from "drizzle-orm";

export const pushSubscriptionsKey = "pushSubscriptions";

export const findPushSubscriptionBySessionId = async (sessionId: string) => {
  const rows = await db
    .select()
    .from(pushSubscriptionTable)
    .where(eq(pushSubscriptionTable.sessionId, sessionId));

  if (isArrayEmpty(rows)) return null;
  return rows[0];
};
