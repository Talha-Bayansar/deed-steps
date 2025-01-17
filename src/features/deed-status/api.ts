"use server";

import { safeAction } from "@/lib/safe-action";
import { getTranslations } from "next-intl/server";
import { requireAuth } from "../auth/api";
import { db } from "@/db";
import { deedStatusTable } from "@/db/schema";
import { z } from "zod";
import { createErrorResponse, createSuccessResponse } from "@/lib/utils";
import { eq } from "drizzle-orm";

export const createDeedStatus = safeAction
  .schema(
    z.object({
      name: z.string().min(1).max(100),
      color: z.string().min(1).max(100),
      reward: z.number().min(0),
      deedTemplateId: z.number(),
    })
  )
  .action(async ({ parsedInput: { name, color, reward, deedTemplateId } }) => {
    const t = await getTranslations();
    await requireAuth();

    try {
      const res = await db.insert(deedStatusTable).values({
        name,
        color,
        reward: reward.toString(),
        deedTemplateId,
      });

      return createSuccessResponse(res);
    } catch {
      return createErrorResponse(t("somethingWentWrong"));
    }
  });

export const updateDeedStatusById = safeAction
  .schema(
    z.object({
      id: z.number(),
      name: z.string().min(1).max(100),
      color: z.string().min(1).max(100),
      reward: z.number().min(0),
      deedTemplateId: z.number(),
    })
  )
  .action(
    async ({ parsedInput: { id, name, color, reward, deedTemplateId } }) => {
      const t = await getTranslations();
      await requireAuth();

      try {
        const res = await db
          .update(deedStatusTable)
          .set({
            name,
            color,
            reward: reward.toString(),
            deedTemplateId,
          })
          .where(eq(deedStatusTable.id, id));

        return createSuccessResponse(res);
      } catch {
        return createErrorResponse(t("somethingWentWrong"));
      }
    }
  );

export const deleteDeedStatusById = safeAction
  .schema(
    z.object({
      id: z.number(),
    })
  )
  .action(async ({ parsedInput: { id } }) => {
    const t = await getTranslations();
    await requireAuth();

    try {
      const res = await db
        .delete(deedStatusTable)
        .where(eq(deedStatusTable.id, id));

      return createSuccessResponse(res);
    } catch {
      return createErrorResponse(t("somethingWentWrong"));
    }
  });
