"use client";

import { DestructiveModalButton } from "@/components/DestructiveModalButton";
import { View } from "@/components/layout/View";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { DeedStatusForm } from "@/features/deeds/components/DeedStatusForm";
import { DeedStatusTile } from "@/features/deeds/components/DeedStatusTile";
import { useDeedTemplateById } from "@/features/deeds/hooks/useDeedTemplateById";
import { useDeedTemplatesByGroupId } from "@/features/deeds/hooks/useDeedTemplatesByGroupId";
import type { DeedStatus, DeedStatusInsert } from "@/features/deeds/models";
import {
  deleteDeedStatusById,
  updateDeedStatusById,
} from "@/features/deeds/actions/deedStatuses";
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
    mutationFn: async (values: {
      status: DeedStatusInsert;
      deedTemplateId?: number;
    }) => {
      console.log("Submitted");
      await updateDeedStatusById(
        status.id,
        values.status,
        values.deedTemplateId
      );
    },
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
                status: {
                  name: values.name,
                  reward: values.reward,
                  color: values.color,
                },
                deedTemplateId: !values.updateAllInstances
                  ? Number(deedTemplateId)
                  : undefined,
              })
            }
            isLoading={mutation.isPending}
          />

          <DestructiveModalButton
            onContinue={() => deleteMutation.mutate()}
            title={tEditDeedTemplatePage("delete_deed_status_modal_title")}
            description={tEditDeedTemplatePage(
              "delete_deed_status_modal_description"
            )}
          />
        </View>
      </DrawerContent>
    </Drawer>
  );
};
