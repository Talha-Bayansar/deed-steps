"use client";

import { useGroupPointsByGroupId } from "@/features/group/hooks/use-group-points-by-group-id";
import { routes } from "@/lib/routes";
import { Settings } from "lucide-react";
import Link from "next/link";

type Props = {
  groupName: string;
  groupId: string;
};

export const SettingsButton = ({ groupId, groupName }: Props) => {
  const { data } = useGroupPointsByGroupId(Number(groupId));

  if (data?.data?.isOwner)
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
