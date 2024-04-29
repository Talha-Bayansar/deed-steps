"use client";

import { Badge } from "@/components/ui/badge";
import { useMyGroupInvitations } from "../hooks/useMyGroupInvitations";

export const InvitationsBadge = () => {
  const { data } = useMyGroupInvitations();

  if (!data || data.length === 0) return null;

  return (
    <Badge
      className={
        "absolute justify-center shrink-0 top-1 right-1 p-0 w-5 h-5 text-[10px]"
      }
    >
      {data.length > 9 ? "9+" : data.length}
    </Badge>
  );
};
