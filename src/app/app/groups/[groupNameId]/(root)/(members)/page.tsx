import { extractError } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { ErrorState } from "@/components/error-state";

import {
  getGroupUsersByGroupId,
  getMyUserToGroupByGroupId,
} from "@/features/user-to-group/api";
import { GroupMembersView } from "@/features/user-to-group/components/group-members-view";
import { getGroupPointsByGroupId } from "@/features/group-points/api";

type Props = {
  params: Promise<{
    groupNameId: string;
  }>;
};

const GroupMembersPage = async ({ params }: Props) => {
  const { groupNameId } = await params;
  const t = await getTranslations();
  const id = decodeURIComponent(groupNameId).split("_")[1];

  const [groupPoints, groupUsers, currentUserToGroup] = await Promise.all([
    getGroupPointsByGroupId(Number(id)),
    getGroupUsersByGroupId(Number(id)),
    getMyUserToGroupByGroupId(Number(id)),
  ]);

  const groupPointsError = extractError(groupPoints, t);
  const groupUsersError = extractError(groupUsers, t);
  const currentUserToGroupError = extractError(currentUserToGroup, t);

  if (groupPointsError || groupUsersError || currentUserToGroupError)
    return (
      <ErrorState
        error={
          (groupPointsError || groupUsersError || currentUserToGroupError)!
        }
      />
    );

  return (
    <GroupMembersView
      groupMembers={groupUsers.data!}
      groupPoints={groupPoints.data!}
      currentUserToGroup={currentUserToGroup.data!}
    />
  );
};

export default GroupMembersPage;
