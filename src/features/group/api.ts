"use server";

import { db } from "@/db";
import {
  deedStatusTable,
  deedTemplateTable,
  groupPointsTable,
  groupTable,
  pushSubscriptionTable,
  sessionTable,
  transactionTable,
  userTable,
  userToGroupTable,
} from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import {
  createErrorResponse,
  createSuccessResponse,
  isArrayEmpty,
} from "@/lib/utils";
import { sendNotificationToSubscribers } from "@/features/notifications/api";
import { getTranslations } from "next-intl/server";
import { requireAuth } from "../auth/api";
import { safeAction } from "@/lib/safe-action";
import { z } from "zod";

export async function getGroupById(id: number) {
  const t = await getTranslations();
  await requireAuth();

  try {
    const groupRows = await db
      .select()
      .from(groupTable)
      .where(eq(groupTable.id, id))
      .limit(1);

    if (isArrayEmpty(groupRows))
      return createErrorResponse(t("notFound", { subject: t("group") }));

    const group = groupRows[0];

    return createSuccessResponse(group);
  } catch {
    return createErrorResponse(t("somethingWentWrong"));
  }
}

export async function getGroupDetailsById(id: number) {
  const t = await getTranslations();
  const user = await requireAuth();

  try {
    const groupRows = await db
      .select()
      .from(groupTable)
      .where(eq(groupTable.id, id))
      .limit(1);

    if (isArrayEmpty(groupRows))
      return createErrorResponse(t("notFound", { subject: t("group") }));

    const group = groupRows[0];

    const groupMembersWithPoints = await db
      .select({
        member: userTable,
      })
      .from(userToGroupTable)
      .innerJoin(userTable, eq(userToGroupTable.userId, userTable.id))
      .where(eq(userToGroupTable.groupId, id));

    const deedTemplates = await db
      .select()
      .from(deedTemplateTable)
      .where(eq(deedTemplateTable.groupId, id));
    const deedStatuses = await db
      .select()
      .from(deedStatusTable)
      .where(
        inArray(
          deedStatusTable.deedTemplateId,
          deedTemplates.map((dt) => dt.id)
        )
      );

    const duplicateMembers = groupMembersWithPoints.map((item) => item.member);
    const groupMembers = Array.from(
      new Set(duplicateMembers.map((item) => item.id))
    ).map((id) => duplicateMembers.find((member) => member.id === id)!);

    const groupPoints = await db
      .select()
      .from(groupPointsTable)
      .where(
        and(
          inArray(
            groupPointsTable.userId,
            groupMembers.map((gp) => gp.id)
          ),
          eq(groupPointsTable.groupId, id)
        )
      );

    return createSuccessResponse({
      group,
      groupMembers,
      groupPoints,
      isOwner: group.ownerId === user.id,
      deedTemplates: deedTemplates,
      deedStatuses,
    });
  } catch {
    return createErrorResponse(t("somethingWentWrong"));
  }
}

export async function getMyGroups() {
  const t = await getTranslations();
  const user = await requireAuth();

  try {
    const myGroups = await db
      .select()
      .from(userToGroupTable)
      .innerJoin(groupTable, eq(userToGroupTable.groupId, groupTable.id))
      .where(eq(userToGroupTable.userId, user.id));

    const formattedResponse = myGroups.map((item) => ({
      ...item.group,
      isOwner: item.group.ownerId === user.id,
    }));

    return createSuccessResponse(formattedResponse);
  } catch {
    return createErrorResponse(t("somethingWentWrong"));
  }
}

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
      });

      // Initialize group points for the user
      await db.insert(groupPointsTable).values({
        groupId: newGroup[0].id,
        userId: user.id,
      });

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

      return createSuccessResponse(res);
    } catch {
      return createErrorResponse(t("somethingWentWrong"));
    }
  });

export const getGroupPointsByGroupId = async (groupId: number) => {
  const t = await getTranslations();
  const user = await requireAuth();

  try {
    const groupRows = await db
      .select({
        ownerId: groupTable.ownerId,
      })
      .from(groupTable)
      .where(eq(groupTable.id, groupId))
      .limit(1);
    if (isArrayEmpty(groupRows))
      return createErrorResponse(t("notFound", { subject: t("group") }));

    const points = await db
      .select()
      .from(groupPointsTable)
      .where(
        and(
          eq(groupPointsTable.groupId, groupId),
          eq(groupPointsTable.userId, user.id)
        )
      )
      .limit(1);

    return createSuccessResponse({
      groupPoints: points?.[0] || null,
      isOwner: groupRows[0].ownerId === user.id,
    });
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
