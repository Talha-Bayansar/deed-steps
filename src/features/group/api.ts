"use server";

import { db } from "@/db";
import {
  groupPointsTable,
  groupTable,
  pushSubscriptionTable,
  sessionTable,
  userTable,
  userToGroupTable,
} from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import {
  createErrorResponse,
  createSuccessResponse,
  isArrayEmpty,
} from "@/lib/utils";
import { sendNotificationToSubscribers } from "@/features/notification/api";
import { getTranslations } from "next-intl/server";
import { requireAuth } from "../auth/api";
import { safeAction } from "@/lib/safe-action";
import { z } from "zod";
import { cache } from "react";
import { findGroupById, findGroupsByUserId, groupsKey } from "./queries";
import { findDeedTemplatesByGroupId } from "../deed-template/queries";
import { findDeedStatusesByTemplateIds } from "../deed-status/queries";
import { findGroupPointsByGroupId } from "../group-points/queries";
import { revalidateTag } from "next/cache";
import { userToGroupKey } from "../user-to-group/queries";

export const getGroupById = cache(async (id: number) => {
  const t = await getTranslations();
  await requireAuth();

  try {
    const group = await findGroupById(id);

    if (!group)
      return createErrorResponse(t("notFound", { subject: t("group") }));

    return createSuccessResponse(group);
  } catch {
    return createErrorResponse(t("somethingWentWrong"));
  }
});

export const getGroupDetailsById = cache(async (id: number) => {
  const t = await getTranslations();
  await requireAuth();

  try {
    const group = await findGroupById(id);

    if (!group)
      return createErrorResponse(t("notFound", { subject: t("group") }));

    const deedTemplates = await findDeedTemplatesByGroupId(id);

    const deedStatuses = await findDeedStatusesByTemplateIds(
      deedTemplates.map((dt) => dt.id)
    );

    const groupPoints = await findGroupPointsByGroupId(id);

    return createSuccessResponse({
      group,
      groupPoints,
      deedTemplates,
      deedStatuses,
    });
  } catch {
    return createErrorResponse(t("somethingWentWrong"));
  }
});

export const getMyGroups = cache(async () => {
  const t = await getTranslations();
  const user = await requireAuth();

  try {
    const groups = await findGroupsByUserId(user.id);

    return createSuccessResponse(groups);
  } catch {
    return createErrorResponse(t("somethingWentWrong"));
  }
});

export const createGroup = safeAction
  .schema(
    z.object({
      name: z.string(),
    })
  )
  .action(async ({ parsedInput: { name } }) => {
    const user = await requireAuth();
    const t = await getTranslations();

    try {
      // Insert the new group
      const newGroup = await db
        .insert(groupTable)
        .values({
          name,
          ownerId: user.id,
        })
        .returning({
          id: groupTable.id,
        });

      // Add the user to the group
      await db.insert(userToGroupTable).values({
        groupId: newGroup[0].id,
        userId: user.id,
        role: "owner",
      });

      // Initialize group points for the user
      await db.insert(groupPointsTable).values({
        groupId: newGroup[0].id,
        userId: user.id,
      });

      revalidateTag(groupsKey);
      revalidateTag(userToGroupKey);

      return createSuccessResponse(newGroup[0]);
    } catch {
      return createErrorResponse(t("somethingWentWrong"));
    }
  });

export const updateGroupById = safeAction
  .schema(
    z.object({
      groupId: z.number(),
      name: z.string().optional(),
      notifyDeeds: z.boolean().optional(),
      ownerId: z.number().optional(),
    })
  )
  .action(async ({ parsedInput: { groupId, name, notifyDeeds, ownerId } }) => {
    const user = await requireAuth();
    const t = await getTranslations();

    try {
      // Update the group
      const res = await db
        .update(groupTable)
        .set({
          name,
          notifyDeeds,
          ownerId,
        })
        .where(
          and(eq(groupTable.id, groupId), eq(groupTable.ownerId, user.id))
        );

      revalidateTag(groupsKey);
      revalidateTag(userToGroupKey);

      return createSuccessResponse(res);
    } catch {
      return createErrorResponse(t("somethingWentWrong"));
    }
  });

export const deleteGroup = safeAction
  .schema(
    z.object({
      id: z.number(),
    })
  )
  .action(async ({ parsedInput: { id } }) => {
    const user = await requireAuth();
    const t = await getTranslations();

    try {
      // Delete the group (cascades will handle related data)
      const res = await db
        .delete(groupTable)
        .where(and(eq(groupTable.id, id), eq(groupTable.ownerId, user.id)));

      revalidateTag(groupsKey);
      revalidateTag(userToGroupKey);

      return createSuccessResponse(res);
    } catch {
      return createErrorResponse(t("somethingWentWrong"));
    }
  });

export const sendReminderNotification = safeAction
  .schema(
    z.object({
      groupId: z.number(),
      title: z.string(),
      body: z.string(),
    })
  )
  .action(async ({ parsedInput: { groupId, title, body } }) => {
    const t = await getTranslations();
    const user = await requireAuth();

    try {
      const group = await db
        .select({
          group: groupTable,
          members: userToGroupTable,
          sessions: sessionTable,
        })
        .from(groupTable)
        .innerJoin(
          userToGroupTable,
          eq(groupTable.id, userToGroupTable.groupId)
        )
        .innerJoin(userTable, eq(userToGroupTable.userId, userTable.id))
        .innerJoin(sessionTable, eq(userTable.id, sessionTable.userId))
        .where(eq(groupTable.id, groupId));

      if (isArrayEmpty(group))
        return createErrorResponse(t("notFound", { subject: t("group") }));

      const sessionIds = group
        .filter((row) => row.members.userId !== user.id)
        .map((row) => row.sessions?.id)
        .flat()
        .filter((id): id is string => !!id);

      if (!sessionIds.length)
        return createErrorResponse(t("notFound", { subject: t("session") }));

      const subscriptions = await db
        .select()
        .from(pushSubscriptionTable)
        .where(inArray(pushSubscriptionTable.sessionId, sessionIds));

      await sendNotificationToSubscribers(
        { body, title, groupId, userId: user.id },
        subscriptions
      );

      return createSuccessResponse();
    } catch {
      return createErrorResponse(t("somethingWentWrong"));
    }
  });
