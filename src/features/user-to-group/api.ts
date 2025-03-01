"use server";

import { safeAction } from "@/lib/safe-action";
import { z } from "zod";
import { requireAuth } from "../auth/api";
import { getTranslations } from "next-intl/server";
import { createErrorResponse, createSuccessResponse } from "@/lib/utils";
import { db } from "@/db";
import { findGroupById } from "../group/queries";
import { revalidateTag } from "next/cache";
import {
  findGroupUserDetailsByGroupId,
  findUserGroupsByUserId,
  findUserToGroupByUserIdAndGroupId,
  userToGroupKey,
} from "./queries";
import { and, eq } from "drizzle-orm";
import { userToGroupTable } from "@/db/schema";
import { Pagination } from "@/lib/pagination/types";

export const getGroupUserDetailsByGroupId = async (
  groupId: number,
  pagination?: Pagination
) => {
  const t = await getTranslations();
  await requireAuth();

  try {
    const groupUsers = await findGroupUserDetailsByGroupId(groupId, pagination);

    return createSuccessResponse(groupUsers);
  } catch {
    return createErrorResponse(t("somethingWentWrong"));
  }
};

export const getMyUserToGroupByGroupId = async (groupId: number) => {
  const t = await getTranslations();
  const user = await requireAuth();

  try {
    const userToGroup = await findUserToGroupByUserIdAndGroupId(
      user.id,
      groupId
    );

    if (!userToGroup)
      return createErrorResponse(t("notFound", { subject: t("member") }));

    return createSuccessResponse(userToGroup);
  } catch {
    return createErrorResponse(t("somethingWentWrong"));
  }
};

export const getMyUserGroups = async () => {
  const t = await getTranslations();
  const user = await requireAuth();

  try {
    const userGroups = await findUserGroupsByUserId(user.id);

    return createSuccessResponse(userGroups);
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

      const res = await db
        .update(userToGroupTable)
        .set({
          role: "admin",
        })
        .where(
          and(
            eq(userToGroupTable.userId, userId),
            eq(userToGroupTable.groupId, groupId)
          )
        );

      revalidateTag(userToGroupKey);
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
        .update(userToGroupTable)
        .set({
          role: "member",
        })
        .where(
          and(
            eq(userToGroupTable.userId, userId),
            eq(userToGroupTable.groupId, groupId)
          )
        );

      revalidateTag(userToGroupKey);
      return createSuccessResponse(res);
    } catch {
      return createErrorResponse(t("somethingWentWrong"));
    }
  });

export const deleteUserFromGroup = safeAction
  .schema(
    z.object({
      userId: z.number(),
      groupId: z.number(),
    })
  )
  .action(async ({ parsedInput: { userId, groupId } }) => {
    const t = await getTranslations();
    await requireAuth();

    try {
      const res = await db
        .delete(userToGroupTable)
        .where(
          and(
            eq(userToGroupTable.userId, userId),
            eq(userToGroupTable.groupId, groupId)
          )
        );

      revalidateTag(userToGroupKey);

      return createSuccessResponse(res);
    } catch {
      return createErrorResponse(t("somethingWentWrong"));
    }
  });
