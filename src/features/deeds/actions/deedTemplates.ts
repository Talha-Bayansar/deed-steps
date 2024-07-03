"use server";
import { validateRequest } from "@/features/auth/actions/auth";
import { db } from "@/db";
import {
  deedTemplateTable,
  deedTemplateToDeedStatusTable,
  userToGroupTable,
} from "@/db/schema";
import { DrizzleError, and, asc, eq, inArray, sql } from "drizzle-orm";
import type { DeedTemplateInsert } from "../models";
import { Nullable } from "@/lib/utils";

export async function getDeedTemplatesByGroupId(groupId: number) {
  const { user } = await validateRequest();

  if (!user)
    throw new DrizzleError({
      message: "Not authenticated",
    });

  const deedTemplates = await db.query.deedTemplateTable.findMany({
    orderBy: [asc(deedTemplateTable.order)],
    where: eq(deedTemplateTable.groupId, groupId),
    with: {
      statuses: {
        with: {
          deedStatus: true,
        },
      },
    },
  });

  const result = deedTemplates.map((template) => ({
    ...template,
    statuses: template.statuses.sort(
      (a, b) => a.deedStatus.reward - b.deedStatus.reward
    ),
  }));

  return result;
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
      statuses: {
        with: {
          deedStatus: true,
        },
      },
    },
  });

  return {
    ...deedTemplate,
    statuses: deedTemplate?.statuses.sort(
      (a, b) => a.deedStatus.reward - b.deedStatus.reward
    ),
  } as typeof deedTemplate;
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

  if (myGroups.length < 1) return null;

  const groupIds = myGroups.map((item) => item.groupId);

  const deedTemplates = await db.query.deedTemplateTable.findMany({
    orderBy: [asc(deedTemplateTable.order)],
    where: inArray(deedTemplateTable.groupId, groupIds),
    with: {
      statuses: {
        with: {
          deedStatus: true,
        },
      },
      group: true,
    },
  });

  const result = deedTemplates.map((template) => ({
    ...template,
    statuses: template.statuses.sort(
      (a, b) => a.deedStatus.reward - b.deedStatus.reward
    ),
  }));

  return result;
}

export async function changeOrderDeedTemplates(orderedTemplateIds: number[]) {
  const { user } = await validateRequest();

  if (!user)
    throw new DrizzleError({
      message: "Not authenticated",
    });

  for (let index = 0; index < orderedTemplateIds.length; index++) {
    const templateId = orderedTemplateIds[index];
    await db
      .update(deedTemplateTable)
      .set({
        order: index,
      })
      .where(eq(deedTemplateTable.id, templateId));
  }

  return true;
}

export async function createDeedTemplate(
  deedTemplate: Nullable<DeedTemplateInsert, "order">
) {
  const { user } = await validateRequest();

  if (!user)
    throw new DrizzleError({
      message: "Not authenticated",
    });

  const group = await db
    .select({
      highestOrder: sql<number>`max(${deedTemplateTable.order})`,
    })
    .from(deedTemplateTable)
    .where(eq(deedTemplateTable.groupId, deedTemplate.groupId));

  if (group[0] && group[0].highestOrder) {
    await db
      .insert(deedTemplateTable)
      .values({ ...deedTemplate, order: group[0].highestOrder + 1 });
  } else {
    await db.insert(deedTemplateTable).values({ ...deedTemplate, order: 1 });
  }

  return true;
}

export async function duplicateDeedTemplate(
  deedTemplateId: number,
  newName: string
) {
  const { user } = await validateRequest();

  if (!user)
    throw new DrizzleError({
      message: "Not authenticated",
    });

  const deedTemplate = await db.query.deedTemplateTable.findFirst({
    where: eq(deedTemplateTable.id, deedTemplateId),
    with: {
      statuses: true,
    },
  });

  if (!deedTemplate)
    throw new DrizzleError({ message: "Deed template not found" });

  const highestOrderTemplate = await db
    .select({
      highestOrder: sql<number>`max(${deedTemplateTable.order})`,
    })
    .from(deedTemplateTable)
    .where(eq(deedTemplateTable.groupId, deedTemplate.groupId));

  const newDeedTemplateResult = await db
    .insert(deedTemplateTable)
    .values({
      name: newName,
      groupId: deedTemplate.groupId,
      order: highestOrderTemplate[0].highestOrder! + 1,
    })
    .returning({ id: deedTemplateTable.id });

  const newDeedTemplate = newDeedTemplateResult[0];

  const deedTemplateToDeedStatusValues = deedTemplate.statuses.map(
    (status) => ({
      deedTemplateId: newDeedTemplate.id,
      deedStatusId: status.deedStatusId,
    })
  );

  await db
    .insert(deedTemplateToDeedStatusTable)
    .values(deedTemplateToDeedStatusValues);
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

export async function deleteDeedStatusFromDeedTemplate(
  deedTemplateId: number,
  deedStatusId: number
) {
  const { user } = await validateRequest();

  if (!user)
    throw new DrizzleError({
      message: "Not authenticated",
    });

  await db
    .delete(deedTemplateToDeedStatusTable)
    .where(
      and(
        eq(deedTemplateToDeedStatusTable.deedTemplateId, deedTemplateId),
        eq(deedTemplateToDeedStatusTable.deedStatusId, deedStatusId)
      )
    );

  return true;
}

export async function deleteDeedTemplateById(id: number) {
  const { user } = await validateRequest();

  if (!user)
    throw new DrizzleError({
      message: "Not authenticated",
    });

  await db.delete(deedTemplateTable).where(eq(deedTemplateTable.id, id));

  const deedTemplates = await getMyDeedTemplates();

  if (deedTemplates) {
    for (let index = 0; index < deedTemplates.length; index++) {
      const deedTemplate = deedTemplates[index];
      await updateDeedTemplateById(deedTemplate.id, {
        ...deedTemplate,
        order: index,
      });
    }
  }

  return true;
}
