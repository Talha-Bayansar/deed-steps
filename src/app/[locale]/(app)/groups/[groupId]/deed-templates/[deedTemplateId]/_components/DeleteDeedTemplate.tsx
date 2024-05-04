"use client";

import { DeleteButton } from "@/components/DeleteButton";
import { useDeedTemplatesByGroupId } from "@/deeds/hooks/useDeedTemplatesByGroupId";
import { deleteDeedTemplateById } from "@/deeds/service";
import { routes } from "@/lib/routes";
import { useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";

export const DeleteDeedTemplate = () => {
  const router = useRouter();
  const { deedTemplateId, groupId } = useParams<{
    deedTemplateId: string;
    groupId: string;
  }>();
  const { refetch } = useDeedTemplatesByGroupId(groupId);
  const mutation = useMutation({
    mutationFn: async () =>
      await deleteDeedTemplateById(Number(deedTemplateId)),
    onSuccess: async () => {
      await refetch();
      router.push(routes.groups.id(groupId).deedTemplates.root);
    },
  });

  return (
    <DeleteButton
      deleteFn={() => mutation.mutate()}
      modalTitle="Are you sure you want to delete this deed template?"
      modalDescription="This deed template and all related statuses will be permanently deleted."
    />
  );
};
