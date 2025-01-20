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
import { InviteUserForm } from "@/features/invitation/components/invite-user-form";
import { UserRoundPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState } from "react";

export const InviteUserTile = () => {
  const t = useTranslations();
  const { groupNameId } = useParams<{ groupNameId: string }>();
  const id = decodeURIComponent(groupNameId).split("_")[1];
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger className="list-tile">
        <ListTile>
          <UserRoundPlus className="text-primary" />
          {t("inviteUser")}
        </ListTile>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{t("inviteUser")}</DrawerTitle>
        </DrawerHeader>
        <DrawerFooter>
          <InviteUserForm
            groupId={Number(id)}
            onSuccess={() => setIsOpen(false)}
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
