"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyDeedsByDate } from "../api";

export const useMyDeedsByDate = (date: string) => {
  const query = useQuery({
    queryKey: ["myDeeds", date],
    queryFn: async () => await getMyDeedsByDate(date),
  });

  return query;
};
