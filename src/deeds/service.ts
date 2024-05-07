"use server";
import { validateRequest } from "@/auth/service";
import { db } from "@/db";
import {
  deedStatusTable,
  deedTable,
  deedTemplateTable,
  groupPointsTable,
  userToGroupTable,
} from "@/db/schema";
import {
  DrizzleError,
  and,
  asc,
  eq,
  gte,
  inArray,
  lte,
  max,
  ne,
} from "drizzle-orm";
import type {
  DeedInsert,
  DeedStatusInsert,
  DeedTemplateInsert,
} from "./models";
import { endOfDay, startOfDay } from "date-fns";
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
        orderBy: [asc(deedStatusTable.reward)],
      },
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
      statuses: {
        orderBy: [asc(deedStatusTable.reward)],
      },
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
    orderBy: [asc(deedTemplateTable.order)],
    where: eq(userToGroupTable.userId, user.id),
  });

  if (myGroups.length < 1) return;

  const groupIds = myGroups.map((item) => item.groupId);

  const deedTemplates = await db.query.deedTemplateTable.findMany({
    where: inArray(deedTemplateTable.groupId, groupIds),
    with: {
      statuses: {
        orderBy: [asc(deedStatusTable.reward)],
      },
      group: true,
    },
  });

  return deedTemplates;
}

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

    await db.update(groupPointsTable).set({
      groupId: groupPoints.groupId,
      userId: groupPoints.userId,
      points:
        groupPoints.points - previousDeed.status.reward + deedStatus.reward,
    });

    await db.update(deedTable).set(deed).where(eq(deedTable.id, deed.id));
    return true;
  } else {
    await db.insert(deedTable).values(deed);

    await db.update(groupPointsTable).set({
      groupId: groupPoints.groupId,
      userId: groupPoints.userId,
      points: groupPoints.points + deedStatus.reward,
    });

    return true;
  }
}

export async function changeOrderDeedTemplates(
  deedTemplateId: number,
  oldOrder: number,
  newOrder: number
) {
  const { user } = await validateRequest();

  if (!user)
    throw new DrizzleError({
      message: "Not authenticated",
    });

  const deedTemplate = await db.query.deedTemplateTable.findFirst({
    where: eq(deedTemplateTable.id, deedTemplateId),
  });

  if (!deedTemplate)
    throw new DrizzleError({
      message: "Deed template not found",
    });

  if (newOrder > oldOrder) {
    const deedTemplates = await db.query.deedTemplateTable.findMany({
      where: and(
        eq(deedTemplateTable.groupId, deedTemplate.groupId),
        ne(deedTemplateTable.id, deedTemplateId),
        lte(deedTemplateTable.order, newOrder)
      ),
    });
    for (const deedTemplate of deedTemplates) {
      await db
        .update(deedTemplateTable)
        .set({ ...deedTemplate, order: deedTemplate.order - 1 })
        .where(eq(deedTemplateTable.id, deedTemplate.id));
    }
  } else {
    const deedTemplates = await db.query.deedTemplateTable.findMany({
      where: and(
        eq(deedTemplateTable.groupId, deedTemplate.groupId),
        ne(deedTemplateTable.id, deedTemplateId),
        gte(deedTemplateTable.order, newOrder)
      ),
    });
    for (const deedTemplate of deedTemplates) {
      await db
        .update(deedTemplateTable)
        .set({ ...deedTemplate, order: deedTemplate.order + 1 })
        .where(eq(deedTemplateTable.id, deedTemplate.id));
    }
  }

  await db
    .update(deedTemplateTable)
    .set({ ...deedTemplate, order: newOrder })
    .where(eq(deedTemplateTable.id, deedTemplate.id));

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
      highestOrder: max(deedTemplateTable.order),
    })
    .from(deedTemplateTable)
    .where(eq(deedTemplateTable.groupId, deedTemplate.groupId));

  if (group[0] && group[0].highestOrder) {
    await db
      .insert(deedTemplateTable)
      .values({ ...deedTemplate, order: group[0].highestOrder + 1 });
  } else {
    await db.insert(deedTemplateTable).values({ ...deedTemplate, order: 0 });
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
      highestOrder: max(deedTemplateTable.order),
    })
    .from(deedTemplateTable)
    .where(eq(deedTemplateTable.groupId, deedTemplate.groupId));

  const newDeedTemplateResult = await db
    .insert(deedTemplateTable)
    .values({
      name: newName,
      groupId: deedTemplate.groupId,
      order: highestOrderTemplate[0].highestOrder!,
    })
    .returning({ id: deedTemplateTable.id });

  const newDeedTemplate = newDeedTemplateResult[0];
  const deedStatuses = deedTemplate.statuses.map((status) => ({
    name: status.name,
    reward: status.reward,
    color: status.color,
    deedTemplateId: newDeedTemplate.id,
  }));
  await db.insert(deedStatusTable).values(deedStatuses);
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

  await db.delete(deedTable).where(eq(deedTable.deedTemplateId, id));

  await db
    .delete(deedStatusTable)
    .where(eq(deedStatusTable.deedTemplateId, id));

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

export async function deleteDeedStatusById(id: number) {
  const { user } = await validateRequest();

  if (!user)
    throw new DrizzleError({
      message: "Not authenticated",
    });

  await db.delete(deedTable).where(eq(deedTable.deedStatusId, id));

  await db.delete(deedStatusTable).where(eq(deedStatusTable.id, id));

  return true;
}
