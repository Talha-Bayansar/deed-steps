"use client";

import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { DeedStatusForm } from "@/deeds/components/DeedStatusForm";
import { DeedStatusTile } from "@/deeds/components/DeedStatusTile";
import { useDeedTemplateById } from "@/deeds/hooks/useDeedTemplateById";
import { useDeedTemplatesByGroupId } from "@/deeds/hooks/useDeedTemplatesByGroupId";
import type { DeedStatus, DeedStatusInsert } from "@/deeds/models";
import { updateDeedStatusById } from "@/deeds/service";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";

type Props = {
  status: DeedStatus;
};

export const UpdateDeedStatusTile = ({ status }: Props) => {
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

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <DeedStatusTile status={status} />
      </DrawerTrigger>
      <DrawerContent>
        <div className="p-4">
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
        </div>
      </DrawerContent>
    </Drawer>
  );
};
