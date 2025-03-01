"use client";

import { GroupSession } from "../types";
import { CustomResponse, isArrayEmpty } from "@/lib/utils";
import { EmptyState } from "@/components/empty-state";
import { useTranslations } from "next-intl";
import { GroupSessionTile } from "./group-session-tile";
import { InfiniteView } from "@/lib/pagination/components/infinite-view";
import { Pagination } from "@/lib/pagination/types";
import { getPassedGroupSessionsByGroupId } from "../api";
import Link from "next/link";
import { routes } from "@/lib/routes";

type Props = {
  groupSessions: GroupSession[];
  groupId: number;
  groupName: string;
};

export const GroupSessionsView = ({
  groupSessions,
  groupId,
  groupName,
}: Props) => {
  const t = useTranslations();

  const fetchMore = async (pagination: Pagination) => {
    const groupSessions = await getPassedGroupSessionsByGroupId(
      groupId,
      pagination
    );

    return groupSessions as CustomResponse<GroupSession[]>;
  };

  if (isArrayEmpty(groupSessions))
    return (
      <EmptyState
        title={t("emptyWarning")}
        description={t("emptyWarningAction")}
      />
    );

  return (
    <InfiniteView
      initialItems={groupSessions}
      renderItem={(groupSession) => (
        <GroupSessionTile
          key={groupSession.id}
          groupSession={groupSession}
          as={Link}
          href={
            routes.groups
              .nameId(groupName, groupId.toString())
              .history.id(groupSession.id).root
          }
        />
      )}
      fetchMore={fetchMore}
    />
  );
};
