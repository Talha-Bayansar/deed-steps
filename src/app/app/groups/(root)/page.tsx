import { ErrorState } from "@/components/error-state";
import { getMyGroups } from "@/features/group/api";
import { GroupsView } from "@/features/group/components/groups-view";
import { extractError } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

const GroupsRootPage = async () => {
  const t = await getTranslations();
  const groups = await getMyGroups();

  const error = extractError(groups, t);
  if (error) return <ErrorState error={error} />;

  return <GroupsView groups={groups.data!} />;
};

export default GroupsRootPage;
