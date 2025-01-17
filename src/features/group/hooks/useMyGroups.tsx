"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyGroups } from "../actions/groups";

export const useMyGroups = () => {
  const query = useQuery({
    queryKey: ["myGroups"],
    queryFn: async () => await getMyGroups(),
  });

  return query;
};
