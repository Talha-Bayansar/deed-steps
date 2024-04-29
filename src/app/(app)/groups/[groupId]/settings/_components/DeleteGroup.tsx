"use client";
import { DeleteButton } from "@/components/DeleteButton";
import { ListTile } from "@/components/ListTile";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { deleteGroup } from "@/groups/service";
import { routes } from "@/lib/routes";
import { useMutation } from "@tanstack/react-query";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export const DeleteGroup = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async () => await deleteGroup(Number(groupId)),
    onSuccess: () => {
      setIsOpen(false);
      router.push(routes.groups.root);
    },
  });

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <ListTile className="text-destructive">Delete group</ListTile>
      </DrawerTrigger>
      <DrawerContent>
        <div className="p-4">
          <DeleteButton
            deleteFn={() => mutation.mutate()}
            modalTitle="Are you sure you want to delete this group?"
            modalDescription="This action cannot be undone. All data linked to this group will be lost."
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
