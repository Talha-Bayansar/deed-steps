"use server";

import { safeAction } from "@/lib/safe-action";
import { z } from "zod";
import { requireAuth } from "../auth/api";
import { getTranslations } from "next-intl/server";
import { createErrorResponse, createSuccessResponse } from "@/lib/utils";
import { db } from "@/db";
import { groupAdminTable } from "@/db/schema";
import { findGroupById } from "../group/queries";
import { revalidateTag } from "next/cache";
import {
  findGroupAdminsByGroupId,
  findGroupAdminsByUserId,
  groupAdminsKey,
} from "./queries";
import { and, eq } from "drizzle-orm";

export const getGroupAdminsByGroupId = async (groupId: number) => {
  const t = await getTranslations();
  await requireAuth();

  try {
    const admins = await findGroupAdminsByGroupId(groupId);

    return createSuccessResponse(admins);
  } catch {
    return createErrorResponse(t("somethingWentWrong"));
  }
};

export const getGroupAdminsByUserId = async (userId: number) => {
  const t = await getTranslations();
  await requireAuth();

  try {
    const admins = await findGroupAdminsByUserId(userId);

    return createSuccessResponse(admins);
  } catch {
    return createErrorResponse(t("somethingWentWrong"));
  }
};

export const promoteToAdmin = safeAction
  .schema(
    z.object({
      userId: z.number(),
      groupId: z.number(),
    })
  )
  .action(async ({ parsedInput: { userId, groupId } }) => {
    const user = await requireAuth();
    const t = await getTranslations();

    try {
      const group = await findGroupById(groupId);

      if (!group)
        return createErrorResponse(t("notFound", { subject: t("group") }));

      if (group.ownerId !== user.id)
        return createErrorResponse(t("somethingWentWrong"));

      const res = await db.insert(groupAdminTable).values({
        userId,
        groupId,
      });

      revalidateTag(groupAdminsKey);
      return createSuccessResponse(res);
    } catch {
      return createErrorResponse(t("somethingWentWrong"));
    }
  });

export const demoteFromAdmin = safeAction
  .schema(
    z.object({
      userId: z.number(),
      groupId: z.number(),
    })
  )
  .action(async ({ parsedInput: { userId, groupId } }) => {
    const user = await requireAuth();
    const t = await getTranslations();

    try {
      const group = await findGroupById(groupId);

      if (!group)
        return createErrorResponse(t("notFound", { subject: t("group") }));

      if (group.ownerId !== user.id)
        return createErrorResponse(t("somethingWentWrong"));

      const res = await db
        .delete(groupAdminTable)
        .where(
          and(
            eq(groupAdminTable.groupId, groupId),
            eq(groupAdminTable.userId, userId)
          )
        );

      revalidateTag(groupAdminsKey);
      return createSuccessResponse(res);
    } catch {
      return createErrorResponse(t("somethingWentWrong"));
    }
  });
