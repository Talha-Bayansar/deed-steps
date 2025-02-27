import { extractError } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { ErrorState } from "@/components/error-state";

import {
  getGroupUserDetailsByGroupId,
  getMyUserToGroupByGroupId,
} from "@/features/user-to-group/api";
import { GroupMembersView } from "@/features/user-to-group/components/group-members-view";

type Props = {
  params: Promise<{
    groupNameId: string;
  }>;
};

const GroupMembersPage = async ({ params }: Props) => {
  const { groupNameId } = await params;
  const t = await getTranslations();
  const id = decodeURIComponent(groupNameId).split("_")[1];

  const [groupUsers, currentUserToGroup] = await Promise.all([
    getGroupUserDetailsByGroupId(Number(id)),
    getMyUserToGroupByGroupId(Number(id)),
  ]);

  const groupUsersError = extractError(groupUsers, t);
  const currentUserToGroupError = extractError(currentUserToGroup, t);

  if (groupUsersError || currentUserToGroupError)
    return <ErrorState error={(groupUsersError || currentUserToGroupError)!} />;

  return (
    <GroupMembersView
      initialData={groupUsers.data!}
      currentUserToGroup={currentUserToGroup.data!}
      groupId={Number(id)}
    />
  );
};

export default GroupMembersPage;
