"use client";

import { SettingsIconButton } from "@/components/icon-buttons/settings-icon-button";
import { useGroupPointsByGroupId } from "@/features/group-points/hooks/use-group-points-by-group-id";
import { hasGroupPermission } from "@/features/user-to-group/access-control/permissions";
import { routes } from "@/lib/routes";
import Link from "next/link";

type Props = {
  groupName: string;
  groupId: string;
};

export const SettingsButton = ({ groupId, groupName }: Props) => {
  const { data } = useGroupPointsByGroupId(Number(groupId));

  if (
    !!data?.data?.userToGroup &&
    hasGroupPermission(data.data.userToGroup, "settings:read")
  )
    return (
      <SettingsIconButton
        as={Link}
        href={routes.groups.nameId(groupName, groupId).settings.root}
      />
    );
  else {
    return null;
  }
};
