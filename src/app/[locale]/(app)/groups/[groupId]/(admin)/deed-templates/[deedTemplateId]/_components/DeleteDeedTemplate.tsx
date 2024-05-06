"use client";

import { DeleteButton } from "@/components/DeleteButton";
import { useDeedTemplatesByGroupId } from "@/deeds/hooks/useDeedTemplatesByGroupId";
import { deleteDeedTemplateById } from "@/deeds/service";
import { routes } from "@/lib/routes";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useRouter } from "@/navigation";
import { useTranslations } from "next-intl";

export const DeleteDeedTemplate = () => {
  const tEditDeedTemplatePage = useTranslations("EditDeedTemplatePage");
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
      modalTitle={tEditDeedTemplatePage("delete_deed_template_modal_title")}
      modalDescription={tEditDeedTemplatePage(
        "delete_deed_template_modal_description"
      )}
    />
  );
};
