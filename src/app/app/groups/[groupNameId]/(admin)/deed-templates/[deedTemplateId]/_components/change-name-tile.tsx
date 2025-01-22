"use client";

import { ListTile } from "@/components/list-tile";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { UpdateDeedTemplateForm } from "@/features/deed-template/components/update-deed-template-form";
import { DeedTemplate } from "@/features/deed-template/types";
import { useTranslations } from "next-intl";
import { useState } from "react";

type Props = {
  groupName: string;
  groupId: number;
  deedTemplate: DeedTemplate;
};

export const ChangeNameTile = ({ deedTemplate, groupName, groupId }: Props) => {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger className="list-tile">
        <ListTile>{t("changeName")}</ListTile>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{t("changeName")}</DrawerTitle>
        </DrawerHeader>
        <DrawerFooter>
          <UpdateDeedTemplateForm
            groupName={groupName}
            groupId={groupId}
            deedTemplate={deedTemplate}
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
