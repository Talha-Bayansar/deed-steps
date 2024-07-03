"use client";

import { DestructiveModalButton } from "@/components/DestructiveModalButton";
import { useDeedTemplatesByGroupId } from "@/features/deeds/hooks/useDeedTemplatesByGroupId";

import { routes } from "@/lib/routes";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useRouter } from "@/navigation";
import { useTranslations } from "next-intl";
import { deleteDeedTemplateById } from "@/features/deeds/actions/deedTemplates";

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
    <DestructiveModalButton
      onContinue={() => mutation.mutate()}
      title={tEditDeedTemplatePage("delete_deed_template_modal_title")}
      description={tEditDeedTemplatePage(
        "delete_deed_template_modal_description"
      )}
    />
  );
};
