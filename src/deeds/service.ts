"use server";
import { validateRequest } from "@/auth/service";
import { db } from "@/db";
import {
  deedStatusTable,
  deedTemplateTable,
  userToGroupTable,
} from "@/db/schema";
import { DrizzleError, eq, inArray } from "drizzle-orm";
import type { DeedStatusInsert, DeedTemplateInsert } from "./models";

export async function getDeedTemplatesByGroupId(groupId: number) {
  const { user } = await validateRequest();

  if (!user)
    throw new DrizzleError({
      message: "Not authenticated",
    });

  const deedTemplates = await db.query.deedTemplateTable.findMany({
    where: eq(deedTemplateTable.groupId, groupId),
    with: {
      statuses: true,
    },
  });

  return deedTemplates;
}

export async function getDeedTemplateById(id: number) {
  const { user } = await validateRequest();

  if (!user)
    throw new DrizzleError({
      message: "Not authenticated",
    });

  const deedTemplate = await db.query.deedTemplateTable.findFirst({
    where: eq(deedTemplateTable.id, id),
    with: {
      statuses: true,
    },
  });

  return deedTemplate;
}

export async function getMyDeedTemplates() {
  const { user } = await validateRequest();

  if (!user)
    throw new DrizzleError({
      message: "Not authenticated",
    });

  const myGroups = await db.query.userToGroupTable.findMany({
    where: eq(userToGroupTable.userId, user.id),
  });

  if (myGroups.length < 1)
    throw new DrizzleError({ message: "No groups found" });

  const groupIds = myGroups.map((item) => item.groupId);

  const deedTemplates = await db.query.deedTemplateTable.findMany({
    where: inArray(deedTemplateTable.groupId, groupIds),
    with: {
      statuses: true,
    },
  });

  return deedTemplates;
}

export async function createDeedTemplate(deedTemplate: DeedTemplateInsert) {
  const { user } = await validateRequest();

  if (!user)
    throw new DrizzleError({
      message: "Not authenticated",
    });

  await db.insert(deedTemplateTable).values(deedTemplate);

  return true;
}

export async function createDeedStatus(deedStatus: DeedStatusInsert) {
  const { user } = await validateRequest();

  if (!user)
    throw new DrizzleError({
      message: "Not authenticated",
    });

  await db.insert(deedStatusTable).values(deedStatus);

  return true;
}

export async function updateDeedTemplateById(
  id: number,
  deedTemplateDto: DeedTemplateInsert
) {
  const { user } = await validateRequest();

  if (!user)
    throw new DrizzleError({
      message: "Not authenticated",
    });

  await db
    .update(deedTemplateTable)
    .set(deedTemplateDto)
    .where(eq(deedTemplateTable.id, id));

  return true;
}

export async function updateDeedStatusById(
  id: number,
  status: DeedStatusInsert
) {
  const { user } = await validateRequest();

  if (!user)
    throw new DrizzleError({
      message: "Not authenticated",
    });

  await db
    .update(deedStatusTable)
    .set(status)
    .where(eq(deedStatusTable.id, id));

  return true;
}

export async function deleteDeedTemplateById(id: number) {
  const { user } = await validateRequest();

  if (!user)
    throw new DrizzleError({
      message: "Not authenticated",
    });

  await db
    .delete(deedStatusTable)
    .where(eq(deedStatusTable.deedTemplateId, id));

  await db.delete(deedTemplateTable).where(eq(deedTemplateTable.id, id));

  return true;
}

export async function deleteDeedStatusById(id: number) {
  const { user } = await validateRequest();

  if (!user)
    throw new DrizzleError({
      message: "Not authenticated",
    });

  await db.delete(deedStatusTable).where(eq(deedStatusTable.id, id));

  return true;
}
