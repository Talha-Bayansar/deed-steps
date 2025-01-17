"use client";

import { useQuery } from "@tanstack/react-query";
import { getGroupPointsByGroupId } from "../actions/groups";

export const useGroupPointsByGroupId = (groupId: number) => {
  const query = useQuery({
    queryKey: ["groupPoints", groupId],
    queryFn: async () => await getGroupPointsByGroupId(groupId),
  });

  return query;
};
