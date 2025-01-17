"use client";

import { useQuery } from "@tanstack/react-query";
import { getGroupById } from "../actions/groups";

export const useGroupById = (groupId: string) => {
  const query = useQuery({
    queryKey: ["group", groupId],
    queryFn: async () => await getGroupById(Number(groupId)),
  });

  return query;
};
