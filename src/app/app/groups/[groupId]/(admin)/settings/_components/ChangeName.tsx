"use client";
import { ListTile } from "@/components/list-tile";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { UpdateGroupForm } from "@/features/groups/components/UpdateGroupForm";
import { Pen } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState } from "react";

export const ChangeName = () => {
  const t = useTranslations("GroupSettingsPage");
  const { groupId } = useParams<{ groupId: string }>();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <ListTile>
          <Pen className="text-primary mr-2" size={16} />
          {t("change_name")}
        </ListTile>
      </DrawerTrigger>
      <DrawerContent>
        <div className="p-8 overflow-y-scroll">
          <UpdateGroupForm
            onSuccess={() => setIsOpen(false)}
            groupId={groupId}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
