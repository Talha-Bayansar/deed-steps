"use client";

import { isArrayEmpty } from "@/lib/utils";
import { GroupCard } from "./group-card";
import { useTranslations } from "next-intl";
import { Group } from "../types";
import { View } from "@/components/layout/view";
import { EmptyState } from "@/components/empty-state";
import { UserToGroup } from "@/features/user-to-group/types";

type Props = {
  groups: Group[];
  userGroups: UserToGroup[];
};

export const GroupsView = ({ groups, userGroups }: Props) => {
  const t = useTranslations();

  if (isArrayEmpty(groups))
    return (
      <EmptyState
        title={t("emptyWarning")}
        description={t("emptyWarningAction")}
      />
    );

  return (
    <View>
      {groups.map((group) => (
        <GroupCard
          key={group.id}
          group={group}
          userToGroup={userGroups.find((ug) => ug.groupId === group.id)!}
        />
      ))}
    </View>
  );
};
