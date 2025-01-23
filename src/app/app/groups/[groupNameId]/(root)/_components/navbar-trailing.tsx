"use client";

import { useGroupPointsByGroupId } from "@/features/group/hooks/use-group-points-by-group-id";
import { routes } from "@/lib/routes";
import { Settings } from "lucide-react";
import Link from "next/link";
import { PointsButton } from "./points-button";

type Props = {
  groupName: string;
  groupId: string;
};

export const NavbarTrailing = ({ groupId, groupName }: Props) => {
  const { data } = useGroupPointsByGroupId(Number(groupId));

  return (
    <div className="flex items-center gap-4">
      <PointsButton groupId={Number(groupId)} />
      {data?.data?.isOwner && (
        <Link
          className="text-primary"
          href={routes.groups.nameId(groupName, groupId).settings.root}
        >
          <Settings />
        </Link>
      )}
    </div>
  );
};
