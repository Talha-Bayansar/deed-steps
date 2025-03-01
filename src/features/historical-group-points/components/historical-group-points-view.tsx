"use client";

import { CustomResponse, isArrayEmpty } from "@/lib/utils";
import { EmptyState } from "@/components/empty-state";
import { useTranslations } from "next-intl";
import { InfiniteView } from "@/lib/pagination/components/infinite-view";
import { Pagination } from "@/lib/pagination/types";
import { HistoricalGroupPoints } from "../types";
import { User } from "@/features/auth/types";
import { getHistoricalGroupPointsByGroupSessionId } from "../api";
import { HistoricalGroupPointsTile } from "./historical-group-points-tile";

type Props = {
  historicalPoints: {
    historical_group_points: HistoricalGroupPoints;
    user: User;
  }[];
  groupSessionId: number;
  groupId: number;
  groupName: string;
};

export const HistoricalGroupPointsView = ({
  historicalPoints,
  groupSessionId,
}: Props) => {
  const t = useTranslations();

  const fetchMore = async (pagination: Pagination) => {
    const points = await getHistoricalGroupPointsByGroupSessionId(
      groupSessionId,
      pagination
    );
    return points as CustomResponse<
      {
        historical_group_points: HistoricalGroupPoints;
        user: User;
      }[]
    >;
  };

  if (isArrayEmpty(historicalPoints))
    return (
      <EmptyState
        title={t("emptyWarning")}
        description={t("emptyWarningAction")}
      />
    );

  return (
    <InfiniteView
      initialItems={historicalPoints}
      renderItem={(points) => (
        <HistoricalGroupPointsTile
          key={points.historical_group_points.id}
          hideChevron
          historicalPoints={points}
        />
      )}
      fetchMore={fetchMore}
    />
  );
};
