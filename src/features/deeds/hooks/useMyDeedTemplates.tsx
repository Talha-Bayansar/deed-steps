"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyDeedTemplates } from "../service";

export const useMyDeedTemplates = () => {
  const query = useQuery({
    queryKey: ["myDeedTemplates"],
    queryFn: async () => await getMyDeedTemplates(),
  });

  return query;
};
