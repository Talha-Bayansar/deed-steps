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
import { revalidateTag } from "next/cache";
import { findTransactionsByGroupId, transactionKey } from "./queries";
import { groupPointsKey } from "../group-points/queries";
import { Pagination } from "@/lib/pagination/types";

export const getTransactionsByGroupId = async (
  groupId: number,
  pagination?: Pagination
) => {
  const t = await getTranslations();
  await requireAuth();

  try {
    const transactions = await findTransactionsByGroupId(groupId, pagination);

    return createSuccessResponse(transactions);
  } catch {
    return createErrorResponse(t("somethingWentWrong"));
  }
};

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

      await db.insert(transactionTable).values({
        userId: user.id,
        groupId,
        amount: amount.toString(),
      });

      revalidateTag(transactionKey);
      revalidateTag(groupPointsKey);

      return createSuccessResponse(res);
    } catch {
      return createErrorResponse(t("somethingWentWrong"));
    }
  });
