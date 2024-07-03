"use server";
import { validateRequest } from "@/features/auth/actions/auth";
import { db } from "@/db";
import { deedStatusTable, deedTemplateToDeedStatusTable } from "@/db/schema";
import { DrizzleError, and, eq } from "drizzle-orm";
import type { DeedStatusInsert } from "../models";

export async function createDeedStatus(
  deedStatus: DeedStatusInsert,
  deedTemplateId: number
) {
  const { user } = await validateRequest();

  if (!user)
    throw new DrizzleError({
      message: "Not authenticated",
    });

  const newStatus = await db
    .insert(deedStatusTable)
    .values(deedStatus)
    .returning();
  await db
    .insert(deedTemplateToDeedStatusTable)
    .values({ deedStatusId: newStatus[0].id, deedTemplateId });

  return true;
}

export async function updateDeedStatusById(
  id: number,
  status: DeedStatusInsert,
  deedTemplateId?: number
) {
  const { user } = await validateRequest();

  if (!user)
    throw new DrizzleError({
      message: "Not authenticated",
    });

  if (deedTemplateId) {
    const newStatus = await db
      .insert(deedStatusTable)
      .values(status)
      .returning();
    await db
      .update(deedTemplateToDeedStatusTable)
      .set({ deedStatusId: newStatus[0].id })
      .where(
        and(
          eq(deedTemplateToDeedStatusTable.deedTemplateId, deedTemplateId),
          eq(deedTemplateToDeedStatusTable.deedStatusId, id)
        )
      );
  } else {
    await db
      .update(deedStatusTable)
      .set(status)
      .where(eq(deedStatusTable.id, id));
  }

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
