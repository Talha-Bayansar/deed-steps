"use server";

import { getTranslations } from "next-intl/server";
import { requireAuth } from "../auth/api";
import {
  createErrorResponse,
  createSuccessResponse,
  isArrayEmpty,
} from "@/lib/utils";
import { db } from "@/db";
import { deedStatusTable, deedTemplateTable } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { safeAction } from "@/lib/safe-action";
import { z } from "zod";
import { revalidateTag } from "next/cache";
import { findGroupsByUserId } from "../group/queries";
import {
  deedTemplatesKey,
  findDeedTemplateById,
  findDeedTemplatesByGroupId,
  findDeedTemplatesByGroupIds,
} from "./queries";
import {
  findDeedStatusesByTemplateId,
  findDeedStatusesByTemplateIds,
} from "../deed-status/queries";

export const getDeedTemplatesByGroupId = async (groupId: number) => {
  await requireAuth();
  const t = await getTranslations();

  try {
    const deedTemplates = await findDeedTemplatesByGroupId(groupId);

    if (isArrayEmpty(deedTemplates))
      return createSuccessResponse({
        deedTemplates: [],
        deedStatuses: [],
      });

    const deedTemplateIds = deedTemplates.map((dt) => dt.id);

    const deedStatuses = await findDeedStatusesByTemplateIds(deedTemplateIds);

    return createSuccessResponse({
      deedTemplates,
      deedStatuses,
    });
  } catch {
    return createErrorResponse(t("somethingWentWrong"));
  }
};

export const getDeedTemplateById = async (id: number) => {
  await requireAuth();
  const t = await getTranslations();

  try {
    const deedTemplate = await findDeedTemplateById(id);

    if (!deedTemplate)
      return createErrorResponse(t("notFound", { subject: t("deedTemplate") }));

    const deedStatuses = await findDeedStatusesByTemplateId(id);

    return createSuccessResponse({
      deedTemplate,
      deedStatuses,
    });
  } catch {
    return createErrorResponse(t("somethingWentWrong"));
  }
};

export const getMyDeedTemplates = async () => {
  const user = await requireAuth();
  const t = await getTranslations();

  try {
    const groups = await findGroupsByUserId(user.id);

    if (isArrayEmpty(groups))
      return createSuccessResponse({
        groups: [],
        deedTemplates: [],
        deedStatuses: [],
      });

    const groupIds = groups.map((item) => item.id);

    const deedTemplates = await findDeedTemplatesByGroupIds(groupIds);

    if (isArrayEmpty(deedTemplates))
      return createSuccessResponse({
        groups: groups,
        deedTemplates: [],
        deedStatuses: [],
      });

    const deedTemplateIds = deedTemplates.map((item) => item.id);

    const deedStatuses = await findDeedStatusesByTemplateIds(deedTemplateIds);

    const response = {
      groups,
      deedTemplates,
      deedStatuses,
    };

    return createSuccessResponse(response);
  } catch {
    return createErrorResponse(t("somethingWentWrong"));
  }
};

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

      revalidateTag(deedTemplatesKey);

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
      recurrence: z.string(),
    })
  )
  .action(async ({ parsedInput: { name, groupId, recurrence } }) => {
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
          recurrencyRule: recurrence,
        });
      } else {
        await db.insert(deedTemplateTable).values({
          name,
          groupId,
          order: deedTemplates[0].order + 1,
          recurrencyRule: recurrence,
        });
      }

      revalidateTag(deedTemplatesKey);

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

      if (isArrayEmpty(deedTemplateStatuses))
        return createErrorResponse(t("notFound", { subject: t("deedStatus") }));

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
          recurrencyRule: deedTemplate.recurrencyRule,
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

      revalidateTag(deedTemplatesKey);

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
      recurrence: z.string(),
    })
  )
  .action(async ({ parsedInput: { id, name, recurrence } }) => {
    await requireAuth();
    const t = await getTranslations();

    try {
      const response = await db
        .update(deedTemplateTable)
        .set({
          name,
          recurrencyRule: recurrence,
        })
        .where(eq(deedTemplateTable.id, id));

      revalidateTag(deedTemplatesKey);

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

      revalidateTag(deedTemplatesKey);

      return createSuccessResponse(deletedTemplate);
    } catch {
      return createErrorResponse(t("somethingWentWrong"));
    }
  });
