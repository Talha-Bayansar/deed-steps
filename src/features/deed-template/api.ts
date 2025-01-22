"use server";

import { getTranslations } from "next-intl/server";
import { requireAuth } from "../auth/api";
import {
  createErrorResponse,
  createSuccessResponse,
  isArrayEmpty,
} from "@/lib/utils";
import { db } from "@/db";
import {
  deedStatusTable,
  deedTemplateTable,
  groupTable,
  userToGroupTable,
} from "@/db/schema";
import { desc, eq, inArray } from "drizzle-orm";
import { safeAction } from "@/lib/safe-action";
import { z } from "zod";

export async function getDeedTemplatesByGroupId(groupId: number) {
  await requireAuth();
  const t = await getTranslations();

  try {
    const deedTemplates = await db
      .select()
      .from(deedTemplateTable)
      .where(eq(deedTemplateTable.groupId, groupId));

    if (isArrayEmpty(deedTemplates))
      return createSuccessResponse({
        deedTemplates: [],
        deedStatuses: [],
      });

    const deedTemplateIds = deedTemplates.map((dt) => dt.id);

    const deedStatuses = await db
      .select()
      .from(deedStatusTable)
      .where(inArray(deedStatusTable.deedTemplateId, deedTemplateIds));

    return createSuccessResponse({
      deedTemplates,
      deedStatuses,
    });
  } catch {
    return createErrorResponse(t("somethingWentWrong"));
  }
}

export async function getDeedTemplateById(id: number) {
  const t = await getTranslations();
  await requireAuth();

  try {
    const deedTemplateRows = await db
      .select()
      .from(deedTemplateTable)
      .where(eq(deedTemplateTable.id, id));

    if (isArrayEmpty(deedTemplateRows))
      return createErrorResponse(t("notFound", { subject: t("deedTemplate") }));

    const deedStatuses = await db
      .select()
      .from(deedStatusTable)
      .where(eq(deedStatusTable.deedTemplateId, id));

    return createSuccessResponse({
      deedTemplate: deedTemplateRows[0],
      deedStatuses,
    });
  } catch {
    return createErrorResponse(t("somethingWentWrong"));
  }
}

export async function getMyDeedTemplates() {
  const t = await getTranslations();
  const user = await requireAuth();

  try {
    const groupRows = await db
      .select()
      .from(userToGroupTable)
      .where(eq(userToGroupTable.userId, user.id))
      .innerJoin(groupTable, eq(groupTable.id, userToGroupTable.groupId));

    const groups = groupRows.map((gr) => gr.group);

    if (isArrayEmpty(groups))
      return createSuccessResponse({
        groups: [],
        deedTemplates: [],
        deedStatuses: [],
      });

    const groupIds = groups.map((item) => item.id);

    const deedTemplates = await db
      .select()
      .from(deedTemplateTable)
      .where(inArray(deedTemplateTable.groupId, groupIds));

    if (isArrayEmpty(deedTemplates))
      return createSuccessResponse({
        groups: groups,
        deedTemplates: [],
        deedStatuses: [],
      });

    const deedTemplateIds = deedTemplates.map((item) => item.id);

    const deedStatuses = await db
      .select()
      .from(deedStatusTable)
      .where(inArray(deedStatusTable.deedTemplateId, deedTemplateIds));

    const response = {
      groups,
      deedTemplates,
      deedStatuses,
    };

    return createSuccessResponse(response);
  } catch {
    return createErrorResponse(t("somethingWentWrong"));
  }
}

export const changeOrderDeedTemplates = safeAction
  .schema(
    z.object({
      orderedTemplateIds: z.array(z.number()),
    })
  )
  .action(async ({ parsedInput: { orderedTemplateIds } }) => {
    await requireAuth();
    const t = await getTranslations();

    try {
      for (let index = 0; index < orderedTemplateIds.length; index++) {
        const templateId = orderedTemplateIds[index];
        await db
          .update(deedTemplateTable)
          .set({
            order: index,
          })
          .where(eq(deedTemplateTable.id, templateId));
      }

      return createSuccessResponse();
    } catch {
      return createErrorResponse(t("somethingWentWrong"));
    }
  });

export const createDeedTemplate = safeAction
  .schema(
    z.object({
      name: z.string().min(1).max(50),
      groupId: z.number(),
    })
  )
  .action(async ({ parsedInput: { name, groupId } }) => {
    await requireAuth();
    const t = await getTranslations();

    try {
      const deedTemplates = await db
        .select()
        .from(deedTemplateTable)
        .where(eq(deedTemplateTable.groupId, groupId))
        .orderBy(desc(deedTemplateTable.order))
        .limit(1);

      if (isArrayEmpty(deedTemplates)) {
        await db.insert(deedTemplateTable).values({
          name,
          groupId,
          order: 0,
        });
      } else {
        await db
          .insert(deedTemplateTable)
          .values({ name, groupId, order: deedTemplates[0].order + 1 });
      }

      return createSuccessResponse();
    } catch {
      return createErrorResponse(t("somethingWentWrong"));
    }
  });

export const duplicateDeedTemplate = safeAction
  .schema(
    z.object({
      deedTemplateId: z.number(),
      newName: z.string().min(1).max(50),
    })
  )
  .action(async ({ parsedInput: { deedTemplateId, newName } }) => {
    await requireAuth();
    const t = await getTranslations();

    try {
      const deedTemplateRows = await db
        .select()
        .from(deedTemplateTable)
        .where(eq(deedTemplateTable.id, deedTemplateId));

      if (isArrayEmpty(deedTemplateRows))
        return createErrorResponse(
          t("notFound", { subject: t("deedTemplate") })
        );

      const deedTemplate = deedTemplateRows[0];

      const deedTemplateStatuses = await db
        .select()
        .from(deedStatusTable)
        .where(eq(deedStatusTable.deedTemplateId, deedTemplateId));

      const highestOrderTemplate = await db
        .select()
        .from(deedTemplateTable)
        .where(eq(deedTemplateTable.groupId, deedTemplate.groupId))
        .orderBy(desc(deedTemplateTable.order))
        .limit(1);

      if (isArrayEmpty(highestOrderTemplate))
        return createErrorResponse(t("somethingWentWrong"));

      const newDeedTemplateResult = await db
        .insert(deedTemplateTable)
        .values({
          name: newName,
          groupId: deedTemplate.groupId,
          order: highestOrderTemplate[0].order + 1,
        })
        .returning({ id: deedTemplateTable.id });

      const newDeedTemplate = newDeedTemplateResult[0];
      const deedStatuses = deedTemplateStatuses.map((status) => ({
        name: status.name,
        reward: status.reward,
        color: status.color,
        deedTemplateId: newDeedTemplate.id,
      }));
      const response = await db.insert(deedStatusTable).values(deedStatuses);

      return createSuccessResponse(response);
    } catch {
      return createErrorResponse(t("somethingWentWrong"));
    }
  });

export const updateDeedTemplateById = safeAction
  .schema(
    z.object({
      id: z.number(),
      name: z.string().min(1).max(50),
    })
  )
  .action(async ({ parsedInput: { id, name } }) => {
    await requireAuth();
    const t = await getTranslations();

    try {
      const response = await db
        .update(deedTemplateTable)
        .set({
          name,
        })
        .where(eq(deedTemplateTable.id, id));

      return createSuccessResponse(response);
    } catch {
      return createErrorResponse(t("somethingWentWrong"));
    }
  });

export const deleteDeedTemplateById = safeAction
  .schema(
    z.object({
      id: z.number(),
    })
  )
  .action(async ({ parsedInput: { id } }) => {
    await requireAuth();
    const t = await getTranslations();

    try {
      const deletedTemplate = await db
        .delete(deedTemplateTable)
        .where(eq(deedTemplateTable.id, id))
        .returning();

      const deedTemplates = await db
        .select()
        .from(deedTemplateTable)
        .where(eq(deedTemplateTable.groupId, deletedTemplate[0].groupId));

      if (deedTemplates) {
        for (let index = 0; index < deedTemplates.length; index++) {
          const deedTemplate = deedTemplates[index];
          await db
            .update(deedTemplateTable)
            .set({
              order: index,
            })
            .where(eq(deedTemplateTable.id, deedTemplate.id));
        }
      }

      return createSuccessResponse(deletedTemplate);
    } catch {
      return createErrorResponse(t("somethingWentWrong"));
    }
  });
