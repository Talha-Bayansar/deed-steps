"use client";

import { useQuery } from "@tanstack/react-query";
import { getDeedTemplatesByGroupId } from "../actions/deeds";

export const useDeedTemplatesByGroupId = (groupId: string) => {
  const query = useQuery({
    queryKey: ["deeds", groupId],
    queryFn: async () => await getDeedTemplatesByGroupId(Number(groupId)),
  });

  return query;
};
