import { getPassedGroupSessionsByGroupId } from "@/features/group-session/api";
import { GroupSessionsView } from "@/features/group-session/components/group-sessions-view";
import { ErrorState } from "@/components/error-state";
import { extractError } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{
    groupNameId: string;
  }>;
};

const HistoryPage = async ({ params }: Props) => {
  const { groupNameId } = await params;
  const t = await getTranslations();
  const [name, id] = decodeURIComponent(groupNameId).split("_");

  const groupSessions = await getPassedGroupSessionsByGroupId(Number(id));

  const error = extractError(groupSessions, t);

  if (error) return <ErrorState error={error} />;

  return (
    <GroupSessionsView
      groupSessions={groupSessions.data!}
      groupId={Number(id)}
      groupName={name}
    />
  );
};

export default HistoryPage;
