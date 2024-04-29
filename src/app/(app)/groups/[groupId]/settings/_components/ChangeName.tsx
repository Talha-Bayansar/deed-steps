"use client";
import { ListTile } from "@/components/ListTile";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { UpdateGroupForm } from "@/groups/components/UpdateGroupForm";
import { useParams } from "next/navigation";
import { useState } from "react";

export const ChangeName = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <ListTile>Change name</ListTile>
      </DrawerTrigger>
      <DrawerContent>
        <div className="p-4">
          <UpdateGroupForm
            onSuccess={() => setIsOpen(false)}
            groupId={groupId}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
