"use client";

import { ListTile } from "@/components/ListTile";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { DeedTemplateForm } from "@/features/deeds/components/DeedTemplateForm";
import { useDeedTemplateById } from "@/features/deeds/hooks/useDeedTemplateById";
import { useDeedTemplatesByGroupId } from "@/features/deeds/hooks/useDeedTemplatesByGroupId";
import { DeedTemplateInsert } from "@/features/deeds/models";
import { updateDeedTemplateById } from "@/features/deeds/actions/deedTemplates";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState } from "react";

export const ChangeNameTile = () => {
  const tEditDeedTemplatePage = useTranslations("EditDeedTemplatePage");
  const [isOpen, setIsOpen] = useState(false);
  const { deedTemplateId, groupId } = useParams<{
    deedTemplateId: string;
    groupId: string;
  }>();

  const { data, refetch } = useDeedTemplateById(Number(deedTemplateId));
  const { refetch: refetchGroupDeedTemplates } =
    useDeedTemplatesByGroupId(groupId);

  const deedTemplateMutation = useMutation({
    mutationFn: async (deedTemplate: DeedTemplateInsert) => {
      await updateDeedTemplateById(Number(deedTemplateId), deedTemplate);
    },
    onSuccess: async () => {
      await Promise.all([refetch(), refetchGroupDeedTemplates()]);
      setIsOpen(false);
    },
  });

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <ListTile>{tEditDeedTemplatePage("change_name")}</ListTile>
      </DrawerTrigger>
      <DrawerContent>
        <div className="p-8 overflow-y-scroll">
          <DeedTemplateForm
            deedTemplate={data}
            onSubmit={(values) =>
              deedTemplateMutation.mutate({
                ...values,
                groupId: Number(groupId),
                order: data!.order,
              })
            }
            isLoading={deedTemplateMutation.isPending}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
