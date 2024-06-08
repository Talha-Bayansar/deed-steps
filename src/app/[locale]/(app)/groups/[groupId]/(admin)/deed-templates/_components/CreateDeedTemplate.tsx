"use client";
import { IconButton } from "@/components/IconButton";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { DeedTemplateForm } from "@/features/deeds/components/DeedTemplateForm";
import { useDeedTemplatesByGroupId } from "@/features/deeds/hooks/useDeedTemplatesByGroupId";
import type { DeedTemplateInsert } from "@/features/deeds/models";
import { createDeedTemplate } from "@/features/deeds/service";
import { Nullable } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

export const CreateDeedTemplate = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const [isOpen, setIsOpen] = useState(false);
  const { refetch } = useDeedTemplatesByGroupId(groupId);

  const mutation = useMutation({
    mutationFn: async (deedTemplate: Nullable<DeedTemplateInsert, "order">) =>
      await createDeedTemplate(deedTemplate),
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
          <DeedTemplateForm
            onSubmit={(values) =>
              mutation.mutate({ ...values, groupId: Number(groupId) })
            }
            isLoading={mutation.isPending}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
