"use client";

import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { DeedStatusTile } from "@/features/deed-status/components/deed-status-tile";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { DeedStatus } from "@/features/deed-status/types";
import { UpdateDeedStatusForm } from "@/features/deed-status/components/update-deed-status-form";
import { DeleteDeedStatusAlertDialog } from "@/features/deed-status/components/delete-deed-status-alert-dialog";
import { Button } from "@/components/ui/button";
import { View } from "@/components/layout/a-new-view";

type Props = {
  status: DeedStatus;
};

export const UpdateDeedStatusTile = ({ status }: Props) => {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger className="list-tile">
        <DeedStatusTile status={status} />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{status.name}</DrawerTitle>
        </DrawerHeader>
        <DrawerFooter>
          <View>
            <UpdateDeedStatusForm
              deedStatus={status}
              onSuccess={() => setIsOpen(false)}
            />
            <DeleteDeedStatusAlertDialog deedStatusId={status.id}>
              <Button variant={"destructive"}>{t("delete")}</Button>
            </DeleteDeedStatusAlertDialog>
          </View>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
