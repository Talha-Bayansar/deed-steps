"use client";

import { useQuery } from "@tanstack/react-query";
import { getGroupById } from "../service";
import { Title, TitleSkeleton } from "@/components/layout/Title";
import { EmptyView } from "@/components/EmptyView";
import { Users } from "lucide-react";

type Props = {
  groupId: string;
};

export const GroupDetailsView = ({ groupId }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ["group", groupId],
    queryFn: async () => await getGroupById(Number(groupId)),
  });

  if (isLoading) return <GroupDetailsViewSkeleton />;
  if (!data)
    return <EmptyView Icon={Users} message="This group could not be found." />;

  return (
    <>
      <Title>{data.name}</Title>
    </>
  );
};

const GroupDetailsViewSkeleton = () => {
  return (
    <>
      <TitleSkeleton />
    </>
  );
};
