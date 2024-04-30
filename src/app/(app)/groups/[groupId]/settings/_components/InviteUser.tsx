"use client";
import { ListTile } from "@/components/ListTile";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { InviteUserToGroupForm } from "@/groups/components/InviteUserToGroupForm";
import { inviteUserToGroup } from "@/groups/service";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const InviteUser = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { groupId } = useParams<{ groupId: string }>();
  const mutation = useMutation({
    mutationFn: async (email: string) =>
      await inviteUserToGroup(email, Number(groupId)),
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("User successfully invited");
      setIsOpen(false);
    },
  });

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <ListTile>Invite user</ListTile>
      </DrawerTrigger>
      <DrawerContent>
        <div className="p-4">
          <InviteUserToGroupForm
            onSubmit={(values) => mutation.mutate(values.email)}
            isLoading={mutation.isPending}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
