"use client";

import { Badge } from "@/components/ui/badge";
import { useMyInvitations } from "@/features/invitation/hooks/use-my-invitations";
import { isArrayEmpty } from "@/lib/utils";

export const InvitationsBadge = () => {
  const { data } = useMyInvitations();

  if (isArrayEmpty(data?.data || [])) return null;

  return (
    <Badge
      className={
        "absolute justify-center shrink-0 top-1 right-1 p-0 w-5 h-5 text-[10px]"
      }
    >
      {data!.data!.length > 9 ? "9+" : data!.data!.length}
    </Badge>
  );
};
