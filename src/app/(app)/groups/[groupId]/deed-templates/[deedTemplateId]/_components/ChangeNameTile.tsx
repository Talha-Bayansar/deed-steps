"use client";

import { ListTile } from "@/components/ListTile";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { DeedTemplateForm } from "@/deeds/components/DeedTemplateForm";
import { useDeedTemplateById } from "@/deeds/hooks/useDeedTemplateById";
import { useDeedTemplatesByGroupId } from "@/deeds/hooks/useDeedTemplatesByGroupId";
import { DeedTemplateInsert } from "@/deeds/models";
import { updateDeedTemplateById } from "@/deeds/service";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";

export const ChangeNameTile = () => {
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
        <ListTile>Change name</ListTile>
      </DrawerTrigger>
      <DrawerContent>
        <div className="p-8">
          <DeedTemplateForm
            deedTemplate={data}
            onSubmit={(values) =>
              deedTemplateMutation.mutate({
                ...values,
                groupId: Number(groupId),
              })
            }
            isLoading={deedTemplateMutation.isPending}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
