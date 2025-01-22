"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyDeedsByDate } from "../api";

export const getMyDeedsByDateKey = (date: string) => ["myDeeds", date];

export const useMyDeedsByDate = (date: string) => {
  const query = useQuery({
    queryKey: getMyDeedsByDateKey(date),
    queryFn: async () => await getMyDeedsByDate(date),
  });

  return query;
};
