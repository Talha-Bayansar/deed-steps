"use client";

import { EmptyView } from "@/components/EmptyView";
import { useGroupById } from "../hooks/useGroupById";
import { GroupForm } from "./GroupForm";
import { Users } from "lucide-react";
import type { Group, GroupInsert } from "../models";
import { useMutation } from "@tanstack/react-query";
import { updateGroup } from "../service";
import { useRouter } from "next/navigation";
import { routes } from "@/lib/routes";
import { type Nullable } from "@/lib/utils";

type Props = {
  groupId: string;
};

export const UpdateGroupForm = ({ groupId }: Props) => {
  const router = useRouter();
  const { data, isLoading, refetch } = useGroupById(groupId);
  const mutation = useMutation({
    mutationFn: async (group: Nullable<GroupInsert, "ownerId">) => {
      await updateGroup(Number(groupId), group);
    },
    onSuccess: async () => {
      await refetch();
      router.push(routes.groups.id(groupId).root);
    },
  });

  if (isLoading) return <GroupForm onSubmit={() => {}} isLoading />;

  if (!data || !data.isOwner)
    return <EmptyView Icon={Users} message="This group could not be found." />;

  return (
    <GroupForm
      group={data as Group}
      onSubmit={(values) => mutation.mutate(values)}
    />
  );
};
