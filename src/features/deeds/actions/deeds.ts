"use server";
import { validateRequest } from "@/features/auth/actions/auth";
import { db } from "@/db";
import {
  deedStatusTable,
  deedTable,
  deedTemplateTable,
  groupPointsTable,
  groupTable,
} from "@/db/schema";
import { DrizzleError, and, eq, gte, lte } from "drizzle-orm";
import type { DeedInsert } from "../models";
import { endOfDay, startOfDay } from "date-fns";
import type { GroupMessage } from "@/features/notifications/models";
import { getTranslations } from "next-intl/server";
import { sendNotificationToSubscribers } from "@/features/notifications/actions/notifications";

export async function getMyDeedsByDate(date: Date) {
  const { user } = await validateRequest();

  if (!user)
    throw new DrizzleError({
      message: "Not authenticated",
    });

  const startOfDate = startOfDay(date);
  const endOfDate = endOfDay(date);

  const myDeeds = await db.query.deedTable.findMany({
    where: and(
      eq(deedTable.userId, user.id),
      gte(deedTable.date, startOfDate),
      lte(deedTable.date, endOfDate)
    ),
  });

  return myDeeds;
}

export async function saveDeed(deed: DeedInsert) {
  const { user } = await validateRequest();

  if (!user)
    throw new DrizzleError({
      message: "Not authenticated",
    });

  const deedTemplate = await db.query.deedTemplateTable.findFirst({
    where: eq(deedTemplateTable.id, deed.deedTemplateId),
    with: {
      group: true,
    },
  });

  if (!deedTemplate)
    throw new DrizzleError({
      message: "Deed template not found",
    });

  const deedStatus = await db.query.deedStatusTable.findFirst({
    where: eq(deedStatusTable.id, deed.deedStatusId),
  });

  if (!deedStatus)
    throw new DrizzleError({
      message: "Deed status not found",
    });

  const groupPoints = await db.query.groupPointsTable.findFirst({
    where: and(
      eq(groupPointsTable.groupId, deedTemplate.groupId),
      eq(groupPointsTable.userId, deed.userId)
    ),
  });

  if (!groupPoints)
    throw new DrizzleError({
      message: "Group points not found",
    });

  if (deed.id) {
    const previousDeed = await db.query.deedTable.findFirst({
      where: eq(deedTable.id, deed.id),
      with: {
        status: true,
      },
    });

    if (!previousDeed)
      throw new DrizzleError({
        message: "Deed not found",
      });

    await db
      .update(groupPointsTable)
      .set({
        points:
          groupPoints.points - previousDeed.status.reward + deedStatus.reward,
      })
      .where(eq(groupPointsTable.id, groupPoints.id));

    await db.update(deedTable).set(deed).where(eq(deedTable.id, deed.id));
  } else {
    await db.insert(deedTable).values(deed);

    await db
      .update(groupPointsTable)
      .set({
        points: groupPoints.points + deedStatus.reward,
      })
      .where(eq(groupPointsTable.id, groupPoints.id));

    if (!!deedTemplate.group.hasDeedNotifications && deedStatus.reward > 0) {
      const t = await getTranslations("global.messages");

      await sendDeedNotification({
        title: deedTemplate.group.name,
        body: t("deed_created"),
        userId: user.id,
        groupId: deedTemplate.groupId,
      });
    }
  }

  return true;
}

async function sendDeedNotification(message: GroupMessage) {
  const { userId, groupId } = message;

  const group = await db.query.groupTable.findFirst({
    where: eq(groupTable.id, groupId),
    with: {
      members: {
        where(fields, operators) {
          return operators.ne(fields.userId, userId);
        },
        with: {
          member: {
            with: {
              sessions: {
                columns: { id: true },
              },
            },
          },
        },
      },
    },
  });

  if (!group) throw new Error("Group not found");

  const sessions = group.members.map((member) => member.member.sessions);

  const sessionIds = sessions.reduce<string[]>(
    (prev, curr) => [...prev, ...curr.map((session) => session.id)],
    []
  );

  const subscriptions = await db.query.pushSubscriptionTable.findMany({
    where(fields, operators) {
      return operators.inArray(fields.sessionId, sessionIds);
    },
  });

  await sendNotificationToSubscribers(message, subscriptions);
}
