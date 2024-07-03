"use client";
import { IconButton } from "@/components/IconButton";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { DeedStatusForm } from "@/features/deeds/components/DeedStatusForm";
import { useDeedTemplateById } from "@/features/deeds/hooks/useDeedTemplateById";
import type { DeedStatusInsert } from "@/features/deeds/models";
import { createDeedStatus } from "@/features/deeds/actions/deedStatuses";
import { useMutation } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

export const CreateDeedStatus = () => {
  const { deedTemplateId } = useParams<{ deedTemplateId: string }>();
  const [isOpen, setIsOpen] = useState(false);
  const { refetch } = useDeedTemplateById(Number(deedTemplateId));

  const mutation = useMutation({
    mutationFn: async (deedStatus: DeedStatusInsert) =>
      await createDeedStatus(deedStatus, Number(deedTemplateId)),
    onSuccess: async () => {
      await refetch();
      setIsOpen(false);
    },
  });

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <IconButton>
          <Plus className="text-primary" />
        </IconButton>
      </DrawerTrigger>
      <DrawerContent>
        <div className="p-8 overflow-y-scroll">
          <DeedStatusForm
            onSubmit={(values) => mutation.mutate(values)}
            isLoading={mutation.isPending}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
