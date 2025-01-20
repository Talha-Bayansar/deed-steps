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
import { UpdateGroupForm } from "@/features/group/components/update-group-form";
import { routes } from "@/lib/routes";
import { Pen } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export const UpdateGroupTile = () => {
  const t = useTranslations();
  const { groupNameId } = useParams<{ groupNameId: string }>();
  const [name, id] = decodeURIComponent(groupNameId).split("_");
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger className="list-tile">
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
          <UpdateGroupForm
            onSuccess={(newValues) => {
              setIsOpen(false);
              router.push(
                routes.groups.nameId(newValues.name, id).settings.root
              );
            }}
            group={{
              id: Number(id),
              name,
            }}
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
