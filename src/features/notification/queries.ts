import { db } from "@/db";
import { pushSubscriptionTable } from "@/db/schema";
import { isArrayEmpty } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const pushSubscriptionsKey = "pushSubscriptions";

export const findPushSubscriptionBySessionId = unstable_cache(
  async (sessionId: string) => {
    const rows = await db
      .select()
      .from(pushSubscriptionTable)
      .where(eq(pushSubscriptionTable.sessionId, sessionId));

    console.log(sessionId, rows);

    if (isArrayEmpty(rows)) return null;
    return rows[0];
  },
  undefined,
  {
    tags: [pushSubscriptionsKey],
  }
);
