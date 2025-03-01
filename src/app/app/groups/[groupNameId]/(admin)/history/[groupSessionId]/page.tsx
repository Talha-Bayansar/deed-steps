import { getHistoricalGroupPointsByGroupSessionId } from "@/features/historical-group-points/api";
import { HistoricalGroupPointsView } from "@/features/historical-group-points/components/historical-group-points-view";
import { ErrorState } from "@/components/error-state";
import { extractError } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{
    groupNameId: string;
    groupSessionId: string;
  }>;
};

const HistoricalGroupPointsPage = async ({ params }: Props) => {
  const { groupNameId, groupSessionId } = await params;
  const t = await getTranslations();
  const [name, id] = decodeURIComponent(groupNameId).split("_");

  const historicalPoints = await getHistoricalGroupPointsByGroupSessionId(
    Number(groupSessionId)
  );

  const error = extractError(historicalPoints, t);

  if (error) return <ErrorState error={error} />;

  return (
    <HistoricalGroupPointsView
      historicalPoints={historicalPoints.data!}
      groupSessionId={Number(groupSessionId)}
      groupId={Number(id)}
      groupName={name}
    />
  );
};

export default HistoricalGroupPointsPage;
