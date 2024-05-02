"use client";

import { UserForm } from "@/auth/components/UserForm";
import { useSession } from "@/auth/hooks/useSession";
import type { UserInsert } from "@/auth/models";
import { updateUser } from "@/auth/service";
import { ListTile } from "@/components/ListTile";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { type Nullable } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export const ChangeName = () => {
  const { data, refetch } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const mutation = useMutation({
    mutationFn: async (userDto: Nullable<UserInsert, "email">) =>
      await updateUser(userDto),
    onSuccess: async () => {
      await refetch();
      toast.success("Successfully updated name");
      setIsOpen(false);
    },
  });

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <ListTile>Change name</ListTile>
      </DrawerTrigger>
      <DrawerContent>
        <div className="p-8">
          <UserForm
            user={data!.user!}
            onSubmit={(values) => mutation.mutate(values)}
            isLoading={mutation.isPending}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
