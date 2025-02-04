import { ErrorState } from "@/components/error-state";
import { getMyGroups } from "@/features/group/api";
import { GroupsView } from "@/features/group/components/groups-view";
import { getMyUserGroups } from "@/features/user-to-group/api";
import { extractError } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

const GroupsRootPage = async () => {
  const t = await getTranslations();

  const [groups, userGroups] = await Promise.all([
    getMyGroups(),
    getMyUserGroups(),
  ]);

  const groupsError = extractError(groups, t);
  const userGroupsError = extractError(userGroups, t);
  if (groupsError || userGroupsError)
    return <ErrorState error={(groupsError || userGroupsError)!} />;

  return <GroupsView groups={groups.data!} userGroups={userGroups.data!} />;
};

export default GroupsRootPage;
