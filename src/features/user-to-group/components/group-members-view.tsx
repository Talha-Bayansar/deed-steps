"use client";

import { CustomResponse, isArrayEmpty } from "@/lib/utils";
import { UserToGroup } from "../types";
import { EmptyState } from "@/components/empty-state";
import { useTranslations } from "next-intl";
import { MemberTile } from "./member-tile";
import { GroupPoints } from "@/features/group/types";
import { User } from "@/features/auth/types";
import { InfiniteView } from "@/lib/pagination/components/infinite-view";
import { getGroupUserDetailsByGroupId } from "../api";
import { useCallback } from "react";
import { Pagination } from "@/lib/pagination/types";

type Props = {
  initialData: {
    user_to_group: UserToGroup;
    user: User;
    group_points: GroupPoints;
  }[];
  groupId: number;
  currentUserToGroup: UserToGroup;
};

export const GroupMembersView = ({
  initialData,
  groupId,
  currentUserToGroup,
}: Props) => {
  const t = useTranslations();

  const fetchMore = useCallback(
    async (pagination: Pagination) => {
      const response = await getGroupUserDetailsByGroupId(groupId, pagination);
      return response as CustomResponse<
        {
          user_to_group: UserToGroup;
          user: User;
          group_points: GroupPoints;
        }[]
      >;
    },
    [currentUserToGroup.groupId]
  );

  if (isArrayEmpty(initialData))
    return (
      <EmptyState
        title={t("emptyWarning")}
        description={t("emptyWarningAction")}
      />
    );

  return (
    <InfiniteView
      initialItems={initialData}
      fetchMore={fetchMore}
      renderItem={(item) => (
        <MemberTile
          key={item.user_to_group.id}
          member={item}
          currentUserToGroup={currentUserToGroup}
        />
      )}
    />
  );
};
