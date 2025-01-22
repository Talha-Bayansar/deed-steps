"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyDeedsByDate } from "../api";

export const useMyDeedsByDateKey = (date: string) => ["myDeeds", date];

export const useMyDeedsByDate = (date: string) => {
  const query = useQuery({
    queryKey: useMyDeedsByDateKey(date),
    queryFn: async () => await getMyDeedsByDate(date),
  });

  return query;
};
