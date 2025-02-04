"use client";

import { useGroupPointsByGroupId } from "@/features/group-points/hooks/use-group-points-by-group-id";
import { hasGroupPermission } from "@/features/user-to-group/access-control/permissions";
import { routes } from "@/lib/routes";
import { Settings } from "lucide-react";
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
      <Link
        className="text-primary"
        href={routes.groups.nameId(groupName, groupId).settings.root}
      >
        <Settings />
      </Link>
    );
  else {
    return null;
  }
};
