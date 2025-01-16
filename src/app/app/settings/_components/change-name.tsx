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
import { Pen } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { UpdateUserNameForm } from "@/features/auth/containers/update-user-name-form";
import { User } from "@/features/auth/types";

type Props = {
  user: User;
};

export const ChangeName = ({ user }: Props) => {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger className="w-full">
        <ListTile>
          <Pen className="text-primary" />
          {t("changeName")}
        </ListTile>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{t("changeName")}</DrawerTitle>
        </DrawerHeader>
        <DrawerFooter>
          <UpdateUserNameForm onSuccess={() => setIsOpen(false)} user={user} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
