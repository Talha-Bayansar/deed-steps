"use server";

import { safeAction } from "@/lib/safe-action";
import { getTranslations } from "next-intl/server";
import { z } from "zod";
import { requireAuth } from "../auth/api";
import { db } from "@/db";
import {
  createErrorResponse,
  createSuccessResponse,
  isArrayEmpty,
} from "@/lib/utils";
import { groupPointsTable, historicalGroupPointsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { findGroupSessionById } from "../group-session/queries";
import { groupPointsKey } from "../group-points/queries";

export const createHistoricalGroupPoints = safeAction
  .schema(z.object({ groupSessionId: z.number() }))
  .action(async ({ parsedInput: { groupSessionId } }) => {
    const t = await getTranslations();
    await requireAuth();

    try {
      const groupSession = await findGroupSessionById(groupSessionId);

      if (!groupSession) {
        return createErrorResponse(
          t("notFound", { subject: t("groupSession") })
        );
      }

      const groupPoints = await db
        .select()
        .from(groupPointsTable)
        .where(eq(groupPointsTable.groupId, groupSession.groupId));

      if (isArrayEmpty(groupPoints)) {
        return createErrorResponse(
          t("notFound", { subject: t("groupPoints") })
        );
      }

      const historicalGroupPoints = await db
        .insert(historicalGroupPointsTable)
        .values(
          groupPoints.map((groupPoint) => ({
            groupSessionId: groupSessionId,
            userId: groupPoint.userId,
            finalPoints: groupPoint.totalPoints,
          }))
        );

      const updatedGroupPoints = await db
        .update(groupPointsTable)
        .set({
          totalPoints: "0",
        })
        .where(eq(groupPointsTable.groupId, groupSession.groupId));

      revalidateTag(groupPointsKey);

      return createSuccessResponse({
        historicalGroupPoints,
        updatedGroupPoints,
      });
    } catch (error) {
      console.error(error);
      return createErrorResponse(t("somethingWentWrong"));
    }
  });
