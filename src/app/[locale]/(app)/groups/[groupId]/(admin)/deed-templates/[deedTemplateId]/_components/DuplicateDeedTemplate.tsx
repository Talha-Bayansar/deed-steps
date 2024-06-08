"use client";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { DeedTemplateForm } from "@/features/deeds/components/DeedTemplateForm";
import { useDeedTemplatesByGroupId } from "@/features/deeds/hooks/useDeedTemplatesByGroupId";
import { duplicateDeedTemplate } from "@/features/deeds/actions/deeds";
import { routes } from "@/lib/routes";
import { useRouter } from "@/navigation";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState } from "react";

export const DuplicateDeedTemplate = () => {
  const t = useTranslations("global");
  const { groupId, deedTemplateId } = useParams<{
    groupId: string;
    deedTemplateId: string;
  }>();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { refetch } = useDeedTemplatesByGroupId(groupId);

  const mutation = useMutation({
    mutationFn: async (deedTemplate: { name: string }) =>
      await duplicateDeedTemplate(Number(deedTemplateId), deedTemplate.name),
    onSuccess: async () => {
      await refetch();
      setIsOpen(false);
      router.push(routes.groups.id(groupId).deedTemplates.root);
    },
  });
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button>{t("duplicate")}</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="p-8 overflow-y-scroll">
          <DeedTemplateForm
            onSubmit={(values) => mutation.mutate(values)}
            isLoading={mutation.isPending}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
