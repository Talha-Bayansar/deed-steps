"use server";

import { validateRequest } from "@/auth/service";
import { db } from "@/db";
import {
  deedStatusTable,
  deedTable,
  deedTemplateTable,
  groupPointsTable,
  groupTable,
  invitationTable,
  transactionTable,
  userTable,
  userToGroupTable,
} from "@/db/schema";
import { DrizzleError, and, eq, inArray } from "drizzle-orm";
import type { GroupInsert } from "./models";
import { isArrayEmpty, type Nullable } from "@/lib/utils";

export async function getGroupById(groupId: number) {
  const { user } = await validateRequest();

  if (!user)
    throw new DrizzleError({
      message: "Not authenticated",
    });

  const group = await db.query.groupTable.findFirst({
    where: eq(groupTable.id, groupId),
    with: {
      members: {
        with: {
          member: {
            with: {
              groupPoints: {
                where(fields, { eq }) {
                  return eq(fields.groupId, groupId);
                },
              },
            },
          },
        },
      },
    },
  });

  if (!group) return undefined;

  return { ...group, isOwner: user.id === group?.ownerId };
}

export async function getMyGroups() {
  const { user } = await validateRequest();

  if (!user) throw new DrizzleError({ message: "Not authenticated" });

  const myGroups = await db.query.userToGroupTable.findMany({
    where: eq(userToGroupTable.userId, user.id),
    with: {
      group: true,
    },
  });

  return myGroups.map((item) => ({
    ...item.group,
    isOwner: item.group.ownerId === user.id,
  }));
}

export async function createGroup(group: Nullable<GroupInsert, "ownerId">) {
  const { user } = await validateRequest();

  if (!user) throw new DrizzleError({ message: "Not authenticated" });

  const newGroup = await db
    .insert(groupTable)
    .values({
      name: group.name,
      ownerId: user.id,
    })
    .returning({
      id: groupTable.id,
    });

  await db.insert(userToGroupTable).values({
    groupId: newGroup[0].id,
    userId: user.id,
  });

  await db.insert(groupPointsTable).values({
    groupId: newGroup[0].id,
    userId: user.id,
    points: 0,
  });

  return true;
}

export async function updateGroup(
  groupId: number,
  group: Nullable<GroupInsert, "ownerId">
) {
  const { user } = await validateRequest();

  if (!user) throw new DrizzleError({ message: "Not authenticated" });

  await db.update(groupTable).set(group).where(eq(groupTable.id, groupId));
  return true;
}

export async function deleteGroup(groupId: number) {
  const { user } = await validateRequest();

  if (!user) throw new DrizzleError({ message: "Not authenticated" });
  const deedTemplates = await db.query.deedTemplateTable.findMany({
    where: eq(deedTemplateTable.groupId, groupId),
    columns: { id: true },
  });

  if (!isArrayEmpty(deedTemplates)) {
    const deedTemplateIds = deedTemplates.map(({ id }) => id);

    await db
      .delete(deedTable)
      .where(inArray(deedTable.deedTemplateId, deedTemplateIds));
    await db
      .delete(deedStatusTable)
      .where(inArray(deedStatusTable.deedTemplateId, deedTemplateIds));
    await db
      .delete(deedTemplateTable)
      .where(eq(deedTemplateTable.groupId, groupId));
  }

  await db
    .delete(userToGroupTable)
    .where(eq(userToGroupTable.groupId, groupId));
  await db
    .delete(groupPointsTable)
    .where(eq(groupPointsTable.groupId, groupId));

  await db.delete(invitationTable).where(eq(invitationTable.groupId, groupId));
  await db.delete(groupTable).where(eq(groupTable.id, groupId));
  return true;
}

export async function getMyGroupInvitations() {
  const { user } = await validateRequest();

  if (!user) throw new DrizzleError({ message: "Not authenticated" });

  const invitations = await db.query.invitationTable.findMany({
    where: eq(invitationTable.userId, user.id),
    with: {
      group: true,
    },
  });

  return invitations;
}

export async function inviteUserToGroup(email: string, groupId: number) {
  const { user } = await validateRequest();

  if (!user) throw new DrizzleError({ message: "Not authenticated" });

  const invitedUser = await db.query.userTable.findFirst({
    where: eq(userTable.email, email),
  });

  if (!invitedUser) throw new DrizzleError({ message: "User not found" });

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

  return true;
}

export async function acceptInvitation(invitationId: number) {
  const { user } = await validateRequest();

  if (!user) throw new DrizzleError({ message: "Not authenticated" });
  const invitation = await db.query.invitationTable.findFirst({
    where: and(
      eq(invitationTable.id, invitationId),
      eq(invitationTable.userId, user.id)
    ),
  });

  if (!invitation) throw new DrizzleError({ message: "Invitation not found" });

  await db.insert(userToGroupTable).values({
    userId: invitation.userId,
    groupId: invitation.groupId,
  });

  await db.insert(groupPointsTable).values({
    groupId: invitation.groupId,
    userId: invitation.userId,
    points: 0,
  });

  await db
    .delete(invitationTable)
    .where(
      and(
        eq(invitationTable.groupId, invitation.groupId),
        eq(invitationTable.userId, user.id)
      )
    );

  return true;
}

export async function declineInvitation(invitationId: number) {
  const { user } = await validateRequest();

  if (!user) throw new DrizzleError({ message: "Not authenticated" });

  const invitation = await db.query.invitationTable.findFirst({
    where: and(
      eq(invitationTable.id, invitationId),
      eq(invitationTable.userId, user.id)
    ),
  });

  if (!invitation) throw new DrizzleError({ message: "Invitation not found" });

  await db
    .delete(invitationTable)
    .where(
      and(
        eq(invitationTable.groupId, invitation.groupId),
        eq(invitationTable.userId, user.id)
      )
    );

  return true;
}

export async function deleteUserFromGroup(userId: number, groupId: number) {
  const { user } = await validateRequest();

  if (!user) throw new DrizzleError({ message: "Not authenticated" });

  await db
    .delete(userToGroupTable)
    .where(
      and(
        eq(userToGroupTable.userId, userId),
        eq(userToGroupTable.groupId, groupId)
      )
    );
  return true;
}

export async function getGroupPointsByGroupId(groupId: number) {
  const { user } = await validateRequest();
  if (!user) throw new DrizzleError({ message: "Not authenticated" });

  const points = await db.query.groupPointsTable.findFirst({
    where: and(
      eq(groupPointsTable.groupId, groupId),
      eq(groupPointsTable.userId, user.id)
    ),
  });

  return points;
}

export async function createTransaction(groupId: number, amount: number) {
  const { user } = await validateRequest();

  if (!user) throw new DrizzleError({ message: "Not authenticated" });

  await db.insert(transactionTable).values({
    userId: user.id,
    groupId: groupId,
    amount: amount,
  });

  const groupPointsUser = await db.query.groupPointsTable.findFirst({
    where: and(
      eq(groupPointsTable.groupId, groupId),
      eq(groupPointsTable.userId, user.id)
    ),
  });

  if (!groupPointsUser)
    throw new DrizzleError({
      message: "Group points not found",
    });

  if (groupPointsUser.points < amount)
    throw new DrizzleError({
      message: "Not enough points",
    });

  await db
    .update(groupPointsTable)
    .set({
      points: groupPointsUser.points - amount,
    })
    .where(eq(groupPointsTable.id, groupPointsUser.id));
  return true;
}
