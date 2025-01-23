"use client";

import { getGroupPointsByGroupId } from "@/features/group-points/api";
import { useQuery } from "@tanstack/react-query";

export const useGroupPointsByGroupId = (groupId: number) => {
  const query = useQuery({
    queryKey: ["groupPoints", groupId],
    queryFn: async () => await getGroupPointsByGroupId(groupId),
  });

  return query;
};
