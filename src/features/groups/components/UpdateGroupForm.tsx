"use client";

import { EmptyView } from "@/components/EmptyView";
import { useGroupById } from "../hooks/useGroupById";
import { GroupForm } from "./GroupForm";
import { Users } from "lucide-react";
import type { Group, GroupInsert } from "../models";
import { useMutation } from "@tanstack/react-query";
import { updateGroup } from "../actions/groups";
import { type Nullable } from "@/lib/utils";
import { useTranslations } from "next-intl";

type Props = {
  groupId: string;
  onSuccess?: () => void;
};

export const UpdateGroupForm = ({ groupId, onSuccess }: Props) => {
  const t = useTranslations("GroupDetailsPage");
  const { data, isLoading, refetch } = useGroupById(groupId);
  const mutation = useMutation({
    mutationFn: async (group: Nullable<GroupInsert, "ownerId">) => {
      await updateGroup(Number(groupId), group);
    },
    onSuccess: async () => {
      await refetch();
      onSuccess?.();
    },
  });

  if (isLoading) return <GroupForm onSubmit={() => {}} isLoading />;

  if (!data || !data.isOwner)
    return <EmptyView Icon={Users} message={t("no_group")} />;

  return (
    <GroupForm
      group={data as Group}
      onSubmit={(values) => mutation.mutate(values)}
      isLoading={mutation.isPending}
    />
  );
};
