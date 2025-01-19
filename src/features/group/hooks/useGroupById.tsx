"use client";

import { useQuery } from "@tanstack/react-query";
import { getGroupDetailsById } from "../api";

export const useGroupById = (groupId: string) => {
  const query = useQuery({
    queryKey: ["group", groupId],
    queryFn: async () => await getGroupDetailsById(Number(groupId)),
  });

  return query;
};
