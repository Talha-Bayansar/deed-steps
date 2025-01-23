"use server";

import { db } from "@/db";
import { transactionTable, groupPointsTable } from "@/db/schema";
import { safeAction } from "@/lib/safe-action";
import {
  isArrayEmpty,
  createErrorResponse,
  createSuccessResponse,
} from "@/lib/utils";
import { and, eq } from "drizzle-orm";
import { getTranslations } from "next-intl/server";
import { z } from "zod";
import { requireAuth } from "../auth/api";

export const createTransaction = safeAction
  .schema(
    z.object({
      groupId: z.number(),
      amount: z.number(),
    })
  )
  .action(async ({ parsedInput: { groupId, amount } }) => {
    const t = await getTranslations();
    const user = await requireAuth();

    try {
      await db.insert(transactionTable).values({
        userId: user.id,
        groupId,
        amount: amount.toString(),
      });

      const groupPoints = await db
        .select()
        .from(groupPointsTable)
        .where(
          and(
            eq(groupPointsTable.groupId, groupId),
            eq(groupPointsTable.userId, user.id)
          )
        )
        .limit(1);

      if (isArrayEmpty(groupPoints))
        return createErrorResponse(
          t("notFound", { subject: t("groupPoints") })
        );

      const userPoints = Number(groupPoints[0].points);

      if (userPoints < amount) return createErrorResponse(t("notEnoughPoints"));

      const res = await db
        .update(groupPointsTable)
        .set({
          points: (userPoints - amount).toString(),
        })
        .where(eq(groupPointsTable.id, groupPoints[0].id));

      return createSuccessResponse(res);
    } catch {
      return createErrorResponse(t("somethingWentWrong"));
    }
  });
