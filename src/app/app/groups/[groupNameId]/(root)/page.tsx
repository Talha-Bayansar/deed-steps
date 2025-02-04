import { getGroupDetailsById } from "@/features/group/api";
import { extractError } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { ErrorState } from "@/components/error-state";
import { GroupDetailsView } from "./_components/group-details-view";
import {
  getGroupUsersByGroupId,
  getMyUserToGroupByGroupId,
} from "@/features/user-to-group/api";

type Props = {
  params: Promise<{
    groupNameId: string;
  }>;
};

const GroupDetailsPage = async ({ params }: Props) => {
  const { groupNameId } = await params;
  const t = await getTranslations();
  const id = decodeURIComponent(groupNameId).split("_")[1];

  const [groupDetails, groupUsers, currentUserToGroup] = await Promise.all([
    getGroupDetailsById(Number(id)),
    getGroupUsersByGroupId(Number(id)),
    getMyUserToGroupByGroupId(Number(id)),
  ]);

  const groupError = extractError(groupDetails, t);
  const groupUsersError = extractError(groupUsers, t);
  const currentUserToGroupError = extractError(currentUserToGroup, t);

  if (groupError || groupUsersError || currentUserToGroupError)
    return (
      <ErrorState
        error={(groupError || groupUsersError || currentUserToGroupError)!}
      />
    );

  return (
    <GroupDetailsView
      group={groupDetails.data!.group}
      points={groupDetails.data!.groupPoints}
      deedTemplates={groupDetails.data!.deedTemplates}
      deedStatuses={groupDetails.data!.deedStatuses}
      groupUsers={groupUsers.data!}
      currentUserToGroup={currentUserToGroup.data!}
    />
  );
};

export default GroupDetailsPage;
