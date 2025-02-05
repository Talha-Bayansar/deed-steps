"use server";

import { revalidateTag } from "next/cache";
import { safeAction } from "./safe-action";
import { deedStatusesKey } from "@/features/deed-status/queries";
import { deedTemplatesKey } from "@/features/deed-template/queries";
import { groupPointsKey } from "@/features/group-points/queries";
import { groupsKey } from "@/features/group/queries";
import { invitationsKey } from "@/features/invitation/queries";
import { pushSubscriptionsKey } from "@/features/notification/queries";
import { transactionKey } from "@/features/transaction/queries";
import { userToGroupKey } from "@/features/user-to-group/queries";

export const refreshCache = safeAction.action(async () => {
  revalidateTag(deedStatusesKey);
  revalidateTag(deedTemplatesKey);
  revalidateTag(groupsKey);
  revalidateTag(groupPointsKey);
  revalidateTag(invitationsKey);
  revalidateTag(pushSubscriptionsKey);
  revalidateTag(transactionKey);
  revalidateTag(userToGroupKey);
});
