"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { DuplicateDeedTemplateForm } from "@/features/deed-template/components/duplicate-deed-template-form";
import { routes } from "@/lib/routes";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  deedTemplateId: number;
  groupName: string;
  groupId: number;
};

export const DuplicateDeedTemplate = ({
  deedTemplateId,
  groupName,
  groupId,
}: Props) => {
  const t = useTranslations();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button>{t("duplicate")}</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{t("duplicate")}</DrawerTitle>
        </DrawerHeader>

        <DrawerFooter>
          <DuplicateDeedTemplateForm
            deedTemplateId={deedTemplateId}
            onSuccess={() => {
              setIsOpen(false);
              router.push(
                routes.groups.nameId(groupName, groupId).deedTemplates.root
              );
            }}
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
