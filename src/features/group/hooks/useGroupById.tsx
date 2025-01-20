"use client";

import { useQuery } from "@tanstack/react-query";
import { getGroupById } from "../api";

export const useGroupById = (groupId: number) => {
  const query = useQuery({
    queryKey: ["group", groupId],
    queryFn: async () => await getGroupById(groupId),
  });

  return query;
};
