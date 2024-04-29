"use server";

import { validateRequest } from "@/auth/service";
import { db } from "@/db";
import { groupTable, userToGroupTable } from "@/db/schema";
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
