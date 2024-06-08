"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyDeedsByDate } from "../actions/deeds";

export const useMyDeedsByDate = (date: Date) => {
  const query = useQuery({
    queryKey: ["myDeeds", date],
    queryFn: async () => await getMyDeedsByDate(date),
  });

  return query;
};
