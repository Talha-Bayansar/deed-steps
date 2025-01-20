"use server";

import { getTranslations } from "next-intl/server";
import { requireAuth } from "../auth/api";
import { db } from "@/db";
import {
  groupPointsTable,
  groupTable,
  invitationTable,
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
import { safeAction } from "@/lib/safe-action";
import { z } from "zod";
import { sendNotificationToSubscribers } from "../notifications/api";

export const getMyInvitations = async () => {
  const t = await getTranslations();
  const user = await requireAuth();

  try {
    const invitations = await db
      .select()
      .from(invitationTable)
      .innerJoin(groupTable, eq(invitationTable.groupId, groupTable.id))
      .where(eq(invitationTable.userId, user.id));

    return createSuccessResponse(invitations);
  } catch {
    return createErrorResponse(t("somethingWentWrong"));
  }
};

export const inviteUserToGroup = safeAction
  .schema(
    z.object({
      email: z.string().email(),
      groupId: z.number(),
    })
  )
  .action(async ({ parsedInput: { email, groupId } }) => {
    const t = await getTranslations();
    await requireAuth();

    try {
      const invitedUser = await db
        .select()
        .from(userTable)
        .where(eq(userTable.email, email.toLowerCase()))
        .leftJoin(sessionTable, eq(userTable.id, sessionTable.userId))
        .limit(1);

      if (isArrayEmpty(invitedUser))
        return createErrorResponse(t("notFound", { subject: t("user") }));

      const group = await db
        .select()
        .from(groupTable)
        .where(eq(groupTable.id, groupId))
        .limit(1);

      if (isArrayEmpty(group))
        return createErrorResponse(t("notFound", { subject: t("group") }));

      const isUserAlreadyInGroup = await db
        .select()
        .from(userToGroupTable)
        .where(
          and(
            eq(userToGroupTable.userId, invitedUser[0].user.id),
            eq(userToGroupTable.groupId, groupId)
          )
        )
        .limit(1);

      if (!isArrayEmpty(isUserAlreadyInGroup))
        return createErrorResponse(t("userAlreadyInGroup"));

      const isUserAlreadyInvited = await db
        .select()
        .from(invitationTable)
        .where(
          and(
            eq(invitationTable.userId, invitedUser[0].user.id),
            eq(invitationTable.groupId, groupId)
          )
        )
        .limit(1);

      if (!isArrayEmpty(isUserAlreadyInvited))
        return createErrorResponse(t("userAlreadyInvited"));

      await db.insert(invitationTable).values({
        userId: invitedUser[0].user.id,
        groupId,
      });

      const sessionIds = invitedUser
        .map((u) => u.session?.id)
        .filter((s) => s !== null && s !== undefined);

      const subscriptions = await db
        .select()
        .from(pushSubscriptionTable)
        .where(inArray(pushSubscriptionTable.sessionId, sessionIds));

      await sendNotificationToSubscribers(
        {
          title: t("groupInvitedTitle"),
          body: t("groupInvitedBody", { groupName: group[0].name }),
          userId: invitedUser[0].user.id,
        },
        subscriptions
      );

      return createSuccessResponse();
    } catch {
      return createErrorResponse(t("somethingWentWrong"));
    }
  });

export const acceptInvitation = safeAction
  .schema(
    z.object({
      id: z.number(),
    })
  )
  .action(async ({ parsedInput: { id } }) => {
    const t = await getTranslations();
    const user = await requireAuth();

    try {
      const invitation = await db
        .select()
        .from(invitationTable)
        .where(
          and(eq(invitationTable.id, id), eq(invitationTable.userId, user.id))
        )
        .limit(1);

      if (isArrayEmpty(invitation))
        return createErrorResponse(t("notFound", { subject: t("invitation") }));

      await db.insert(userToGroupTable).values({
        userId: invitation[0].userId,
        groupId: invitation[0].groupId,
      });

      await db.insert(groupPointsTable).values({
        groupId: invitation[0].groupId,
        userId: invitation[0].userId,
      });

      await db
        .delete(invitationTable)
        .where(
          and(
            eq(invitationTable.groupId, invitation[0].groupId),
            eq(invitationTable.userId, user.id)
          )
        );

      return createSuccessResponse(invitation);
    } catch {
      return createErrorResponse(t("somethingWentWrong"));
    }
  });

export const declineInvitation = safeAction
  .schema(
    z.object({
      id: z.number(),
    })
  )
  .action(async ({ parsedInput: { id } }) => {
    const t = await getTranslations();
    const user = await requireAuth();

    try {
      const invitation = await db
        .select()
        .from(invitationTable)
        .where(
          and(eq(invitationTable.id, id), eq(invitationTable.userId, user.id))
        )
        .limit(1);

      if (isArrayEmpty(invitation))
        return createErrorResponse(t("notFound", { subject: t("invitation") }));

      const res = await db
        .delete(invitationTable)
        .where(
          and(
            eq(invitationTable.groupId, invitation[0].groupId),
            eq(invitationTable.userId, user.id)
          )
        );

      return createSuccessResponse(res);
    } catch {
      return createErrorResponse(t("somethingWentWrong"));
    }
  });
