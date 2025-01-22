"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyInvitations } from "../api";

export const useMyInvitations = () => {
  const query = useQuery({
    queryKey: ["my-invitations"],
    queryFn: async () => await getMyInvitations(),
  });

  return query;
};
