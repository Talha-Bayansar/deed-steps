"use server";

import { db } from "@/db";
import {
  deedStatusTable,
  deedTable,
  deedTemplateTable,
  groupPointsTable,
  groupTable,
  pushSubscriptionTable,
  sessionTable,
  userTable,
  userToGroupTable,
} from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import type { GroupMessage } from "@/features/notifications/models";
import { getTranslations } from "next-intl/server";
import { sendNotificationToSubscribers } from "@/features/notifications/api";
import { requireAuth } from "../auth/api";
import {
  createErrorResponse,
  createSuccessResponse,
  isArrayEmpty,
} from "@/lib/utils";
import { safeAction } from "@/lib/safe-action";
import { z } from "zod";

export async function getMyDeedsByDate(date: string) {
  const user = await requireAuth();
  const t = await getTranslations();

  try {
    const deeds = await db
      .select()
      .from(deedTable)
      .where(and(eq(deedTable.userId, user.id), eq(deedTable.date, date)));

    return createSuccessResponse(deeds);
  } catch {
    return createErrorResponse(t("somethingWentWrong"));
  }
}

export const saveDeed = safeAction
  .schema(
    z.object({
      deedTemplateId: z.number(),
      deedStatusId: z.number(),
      date: z.string(),
    })
  )
  .action(async ({ parsedInput: { deedTemplateId, deedStatusId, date } }) => {
    const user = await requireAuth();
    const t = await getTranslations();

    try {
      const deedTemplateRows = await db
        .select()
        .from(deedTemplateTable)
        .where(eq(deedTemplateTable.id, deedTemplateId))
        .innerJoin(groupTable, eq(deedTemplateTable.groupId, groupTable.id));

      if (isArrayEmpty(deedTemplateRows))
        return createErrorResponse(
          t("notFound", { subject: t("deedTemplate") })
        );

      const deedTemplate = deedTemplateRows[0];

      const deedStatusRows = await db
        .select()
        .from(deedStatusTable)
        .where(eq(deedStatusTable.id, deedStatusId));

      if (isArrayEmpty(deedStatusRows))
        return createErrorResponse(t("notFound", { subject: t("deedStatus") }));

      const groupPointsRows = await db
        .select()
        .from(groupPointsTable)
        .where(
          and(
            eq(groupPointsTable.groupId, deedTemplateRows[0].group.id),
            eq(groupPointsTable.userId, user.id)
          )
        );

      if (isArrayEmpty(groupPointsRows))
        return createErrorResponse(
          t("notFound", { subject: t("groupPoints") })
        );

      const deedRows = await db
        .select()
        .from(deedTable)
        .where(
          and(
            eq(deedTable.userId, user.id),
            eq(deedTable.deedTemplateId, deedTemplateId),
            eq(deedTable.date, date)
          )
        )
        .innerJoin(
          deedStatusTable,
          eq(deedStatusTable.id, deedTable.deedStatusId)
        )
        .limit(1);

      const deed = deedRows[0];

      const groupPoints = groupPointsRows[0];
      const deedStatus = deedStatusRows[0];

      if (deed) {
        await db
          .update(groupPointsTable)
          .set({
            points: (
              Number(groupPoints.points) -
              Number(deed.deed_status.reward) +
              Number(deedStatus.reward)
            ).toString(),
          })
          .where(eq(groupPointsTable.id, groupPoints.id));

        await db
          .update(deedTable)
          .set({
            deedStatusId: deedStatusId,
          })
          .where(eq(deedTable.id, deed.deed.id));
      } else {
        if (!date)
          return createErrorResponse(
            t("validations.required", { field: t("date") })
          );

        await db.insert(deedTable).values({
          userId: user.id,
          deedTemplateId: deedTemplateId,
          deedStatusId: deedStatusId,
          date: date,
        });

        await db
          .update(groupPointsTable)
          .set({
            points: (
              Number(groupPoints.points) + Number(deedStatus.reward)
            ).toString(),
          })
          .where(eq(groupPointsTable.id, groupPoints.id));

        if (!!deedTemplate.group.notifyDeeds && Number(deedStatus.reward) > 0) {
          await sendDeedNotification({
            title: deedTemplate.group.name,
            body: t("someoneDidDeed"),
            userId: user.id,
            groupId: deedTemplate.group.id,
          });
        }
      }

      return createSuccessResponse();
    } catch {
      return createErrorResponse(t("somethingWentWrong"));
    }
  });

async function sendDeedNotification(message: GroupMessage) {
  const { userId, groupId } = message;

  const groupMembers = await db
    .select()
    .from(userToGroupTable)
    .where(eq(userToGroupTable.groupId, groupId));

  if (isArrayEmpty(groupMembers)) return;

  const userIds = groupMembers
    .map((gm) => gm.userId)
    .filter((id) => id !== userId);

  const sessions = await db
    .select()
    .from(sessionTable)
    .where(inArray(sessionTable.userId, userIds));

  if (isArrayEmpty(sessions)) return;

  const sessionIds = sessions.map((session) => session.id);

  const subscriptions = await db
    .select()
    .from(pushSubscriptionTable)
    .where(inArray(pushSubscriptionTable.sessionId, sessionIds));

  if (isArrayEmpty(subscriptions)) return;

  await sendNotificationToSubscribers(message, subscriptions);
}
