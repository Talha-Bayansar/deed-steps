"use server";

import { db } from "@/db";
import { groupSessionTable } from "@/db/schema";
import { safeAction } from "@/lib/safe-action";
import { getTranslations } from "next-intl/server";
import { z } from "zod";
import { requireAuth } from "../auth/api";
import {
  createErrorResponse,
  createSuccessResponse,
  isArrayEmpty,
} from "@/lib/utils";
import { and, eq, isNull } from "drizzle-orm";
import { createHistoricalGroupPoints } from "../historical-group-points/api";
import { revalidateTag } from "next/cache";
import { findActiveGroupSessionByGroupId, groupSessionsKey } from "./queries";

export const getActiveGroupSessionByGroupId = async (groupId: number) => {
  const t = await getTranslations();
  await requireAuth();

  try {
    const groupSession = await findActiveGroupSessionByGroupId(groupId);

    return createSuccessResponse(groupSession);
  } catch (error) {
    console.error(error);
    return createErrorResponse(t("somethingWentWrong"));
  }
};

export const startGroupSession = safeAction
  .schema(
    z.object({
      groupId: z.number(),
    })
  )
  .action(async ({ parsedInput: { groupId } }) => {
    const t = await getTranslations();
    await requireAuth();

    try {
      await db
        .update(groupSessionTable)
        .set({ endedAt: new Date() })
        .where(
          and(
            eq(groupSessionTable.groupId, groupId),
            isNull(groupSessionTable.endedAt)
          )
        );

      const groupSession = await db
        .insert(groupSessionTable)
        .values({ groupId });

      revalidateTag(groupSessionsKey);

      return createSuccessResponse(groupSession);
    } catch (error) {
      console.error(error);
      return createErrorResponse(t("somethingWentWrong"));
    }
  });

export const endGroupSession = safeAction
  .schema(
    z.object({
      groupSessionId: z.number(),
      name: z.string(),
      description: z.string().optional().nullable(),
    })
  )
  .action(async ({ parsedInput: { groupSessionId, name, description } }) => {
    const t = await getTranslations();
    await requireAuth();

    try {
      const updatedGroupSessions = await db
        .update(groupSessionTable)
        .set({ endedAt: new Date(), name, description })
        .where(eq(groupSessionTable.id, groupSessionId))
        .returning({ id: groupSessionTable.id });

      if (isArrayEmpty(updatedGroupSessions)) {
        return createErrorResponse(
          t("notFound", { subject: t("groupSession") })
        );
      }

      const historicalGroupPoints = await createHistoricalGroupPoints({
        groupSessionId: updatedGroupSessions[0].id,
      });

      if (!historicalGroupPoints?.data?.success) {
        return createErrorResponse(
          historicalGroupPoints?.data?.message ?? t("somethingWentWrong")
        );
      }

      revalidateTag(groupSessionsKey);

      return createSuccessResponse(updatedGroupSessions[0]);
    } catch (error) {
      console.error(error);
      return createErrorResponse(t("somethingWentWrong"));
    }
  });
