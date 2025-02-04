"use server";

import { getTranslations } from "next-intl/server";
import { requireAuth } from "../auth/api";
import { findGroupById } from "../group/queries";
import { createErrorResponse, createSuccessResponse } from "@/lib/utils";
import { findGroupPointsByUserIdAndGroupId } from "./queries";
import { findUserToGroupByUserIdAndGroupId } from "../user-to-group/queries";

export const getGroupPointsByGroupId = async (groupId: number) => {
  const t = await getTranslations();
  const user = await requireAuth();

  try {
    const group = await findGroupById(groupId);

    if (!group)
      return createErrorResponse(t("notFound", { subject: t("group") }));

    const points = await findGroupPointsByUserIdAndGroupId(user.id, groupId);

    const userToGroup = await findUserToGroupByUserIdAndGroupId(
      user.id,
      groupId
    );

    return createSuccessResponse({
      groupPoints: points,
      userToGroup,
    });
  } catch {
    return createErrorResponse(t("somethingWentWrong"));
  }
};
