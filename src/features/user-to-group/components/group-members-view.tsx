"use client";

import { isArrayEmpty } from "@/lib/utils";
import { UserToGroup } from "../types";
import { EmptyState } from "@/components/empty-state";
import { useTranslations } from "next-intl";
import { View } from "@/components/layout/view";
import { MemberTile } from "./member-tile";
import { GroupPoints } from "@/features/group/types";
import { User } from "@/features/auth/types";

type Props = {
  groupMembers: { user_to_group: UserToGroup; user: User }[];
  groupPoints: GroupPoints[];
  currentUserToGroup: UserToGroup;
};

export const GroupMembersView = ({
  groupMembers,
  groupPoints,
  currentUserToGroup,
}: Props) => {
  const t = useTranslations();

  if (isArrayEmpty(groupMembers))
    return (
      <EmptyState
        title={t("emptyWarning")}
        description={t("emptyWarningAction")}
      />
    );

  return (
    <View>
      {groupMembers.map((user) => (
        <MemberTile
          key={user.user_to_group.id}
          member={user}
          groupPoints={
            groupPoints.find((point) => point.userId === user.user.id)!
          }
          currentUserToGroup={currentUserToGroup}
        />
      ))}
    </View>
  );
};
