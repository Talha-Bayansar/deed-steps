import { getGroupPointsByGroupId } from "@/features/group-points/api";
import { ErrorState } from "@/components/error-state";
import { extractError } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { getUser } from "@/features/auth/api";
import { LeaderboardView } from "@/features/group-points/components/leaderboard-view";

type Props = {
  params: Promise<{
    groupNameId: string;
  }>;
};

const GroupLeaderboardPage = async ({ params }: Props) => {
  const { groupNameId } = await params;
  const id = decodeURIComponent(groupNameId).split("_")[1];
  const t = await getTranslations();

  const [currentUser, groupPoints] = await Promise.all([
    getUser(),
    getGroupPointsByGroupId(Number(id)),
  ]);

  const error = extractError(groupPoints, t);
  if (error) return <ErrorState error={error} />;

  return (
    <LeaderboardView
      groupPoints={groupPoints.data!}
      currentUser={currentUser!}
    />
  );
};

export default GroupLeaderboardPage;
