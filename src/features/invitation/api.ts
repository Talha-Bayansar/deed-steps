"use server";

import { getTranslations } from "next-intl/server";
import { requireAuth } from "../auth/api";
import { db } from "@/db";
import {
  groupPointsTable,
  groupTable,
  invitationTable,
  userToGroupTable,
} from "@/db/schema";
import { and, eq } from "drizzle-orm";
import {
  createErrorResponse,
  createSuccessResponse,
  isArrayEmpty,
} from "@/lib/utils";
import { safeAction } from "@/lib/safe-action";
import { z } from "zod";

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

export async function inviteUserToGroup(email: string, groupId: number) {
  const { user } = await validateRequest();

  if (!user) throw new DrizzleError({ message: "Not authenticated" });

  const invitedUser = await db.query.userTable.findFirst({
    where: eq(userTable.email, email.toLowerCase()),
    with: {
      sessions: true,
    },
  });

  if (!invitedUser) throw new DrizzleError({ message: "User not found" });

  const group = await db.query.groupTable.findFirst({
    where: eq(groupTable.id, groupId),
  });

  if (!group) throw new DrizzleError({ message: "Group not found" });

  const isUserAlreadyInGroup = await db.query.userToGroupTable.findFirst({
    where: and(
      eq(userToGroupTable.userId, invitedUser.id),
      eq(userToGroupTable.groupId, groupId)
    ),
  });

  if (isUserAlreadyInGroup)
    throw new DrizzleError({ message: "User already in group" });

  const isUserAlreadyInvited = await db.query.invitationTable.findFirst({
    where: and(
      eq(invitationTable.userId, invitedUser.id),
      eq(invitationTable.groupId, groupId)
    ),
  });

  if (isUserAlreadyInvited)
    throw new DrizzleError({ message: "User already invited" });

  await db.insert(invitationTable).values({
    userId: invitedUser.id,
    groupId,
  });

  const sessionIds = invitedUser.sessions.map((s) => s.id);
  const subscriptions = await db.query.pushSubscriptionTable.findMany({
    where: inArray(pushSubscriptionTable.sessionId, sessionIds),
  });
  const t = await getTranslations("global.messages");

  await sendNotificationToSubscribers(
    {
      title: t("group_invited_title"),
      body: t("group_invited_body", { groupName: group.name }),
      userId: invitedUser.id,
    },
    subscriptions
  );

  return true;
}

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
