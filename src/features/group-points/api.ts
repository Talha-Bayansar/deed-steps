"use server";

import { getTranslations } from "next-intl/server";
import { requireAuth } from "../auth/api";
import { findGroupById } from "../group/queries";
import { createErrorResponse, createSuccessResponse } from "@/lib/utils";
import { findGroupPointsByUserIdAndGroupId } from "./queries";
import { findGroupAdminsByGroupId } from "../group-admin/queries";
import { isUserAdmin } from "../group-admin/utils";

export const getGroupPointsByGroupId = async (groupId: number) => {
  const t = await getTranslations();
  const user = await requireAuth();

  try {
    const group = await findGroupById(groupId);

    if (!group)
      return createErrorResponse(t("notFound", { subject: t("group") }));

    const points = await findGroupPointsByUserIdAndGroupId(user.id, groupId);

    const groupAdmins = await findGroupAdminsByGroupId(groupId);

    return createSuccessResponse({
      groupPoints: points,
      isOwner: group.ownerId === user.id,
      isAdmin: isUserAdmin(user.id, groupAdmins),
    });
  } catch {
    return createErrorResponse(t("somethingWentWrong"));
  }
};
