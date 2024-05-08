"use client";

import { DeleteButton } from "@/components/DeleteButton";
import { View } from "@/components/layout/View";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { DeedStatusForm } from "@/deeds/components/DeedStatusForm";
import { DeedStatusTile } from "@/deeds/components/DeedStatusTile";
import { useDeedTemplateById } from "@/deeds/hooks/useDeedTemplateById";
import { useDeedTemplatesByGroupId } from "@/deeds/hooks/useDeedTemplatesByGroupId";
import type { DeedStatus, DeedStatusInsert } from "@/deeds/models";
import { deleteDeedStatusById, updateDeedStatusById } from "@/deeds/service";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState } from "react";

type Props = {
  status: DeedStatus;
};

export const UpdateDeedStatusTile = ({ status }: Props) => {
  const tEditDeedTemplatePage = useTranslations("EditDeedTemplatePage");
  const { groupId, deedTemplateId } = useParams<{
    groupId: string;
    deedTemplateId: string;
  }>();
  const [isOpen, setIsOpen] = useState(false);
  const { refetch: refetchTemplate } = useDeedTemplateById(
    Number(deedTemplateId)
  );
  const { refetch: refetchGroupTemplates } = useDeedTemplatesByGroupId(groupId);

  const mutation = useMutation({
    mutationFn: async (values: DeedStatusInsert) =>
      await updateDeedStatusById(status.id, values),
    onSuccess: async () => {
      await Promise.all([refetchTemplate(), refetchGroupTemplates()]);
      setIsOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => await deleteDeedStatusById(status.id),
    onSuccess: async () => {
      await Promise.all([refetchTemplate(), refetchGroupTemplates()]);
      setIsOpen(false);
    },
  });

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <DeedStatusTile status={status} />
      </DrawerTrigger>
      <DrawerContent>
        <View className="p-8 overflow-y-scroll">
          <DeedStatusForm
            status={status}
            onSubmit={(values) =>
              mutation.mutate({
                ...values,
                deedTemplateId: status.deedTemplateId,
              })
            }
            isLoading={mutation.isPending}
          />
          <DeleteButton
            deleteFn={() => deleteMutation.mutate()}
            modalTitle={tEditDeedTemplatePage("delete_deed_status_modal_title")}
            modalDescription={tEditDeedTemplatePage(
              "delete_deed_status_modal_description"
            )}
          />
        </View>
      </DrawerContent>
    </Drawer>
  );
};
