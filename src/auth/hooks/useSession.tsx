"use client";

import { useQuery } from "@tanstack/react-query";
import { validateRequest } from "../service";

export const useSession = () => {
  const query = useQuery({
    queryKey: ["session"],
    queryFn: async () => await validateRequest(),
  });

  return query;
};
