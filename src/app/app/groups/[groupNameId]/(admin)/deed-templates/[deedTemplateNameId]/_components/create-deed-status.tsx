"use client";

import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { CreateDeedStatusForm } from "@/features/deed-status/components/create-deed-status-form";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

type Props = {
  deedTemplateId: number;
};

export const CreateDeedStatus = ({ deedTemplateId }: Props) => {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger>
        <Plus className="text-primary" />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{t("createDeedStatus")}</DrawerTitle>
        </DrawerHeader>
        <DrawerFooter>
          <CreateDeedStatusForm
            deedTemplateId={deedTemplateId}
            onSuccess={() => setIsOpen(false)}
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
