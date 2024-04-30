"use server";

import { validateRequest } from "@/auth/service";
import { db } from "@/db";
import { groupTable, invitationTable, userToGroupTable } from "@/db/schema";
import { DrizzleError, and, eq } from "drizzle-orm";
import type { GroupInsert } from "./models";
import type { Nullable } from "@/lib/utils";

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
          member: true,
        },
      },
    },
  });

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

  await db
    .delete(userToGroupTable)
    .where(eq(userToGroupTable.groupId, groupId));
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

export async function inviteUserToGroup(userId: number, groupId: number) {
  const { user } = await validateRequest();

  if (!user) throw new DrizzleError({ message: "Not authenticated" });

  await db.insert(invitationTable).values({
    userId,
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
