"use client";
import { ListTile } from "@/components/list-tile";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { InviteUserToGroupForm } from "@/features/group/components/InviteUserToGroupForm";
import { inviteUserToGroup } from "@/features/group/actions/groups";
import { useMutation } from "@tanstack/react-query";
import { UserRoundPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const InviteUser = () => {
  const tGroupSettingsPage = useTranslations("GroupSettingsPage");
  const [isOpen, setIsOpen] = useState(false);
  const { groupId } = useParams<{ groupId: string }>();
  const mutation = useMutation({
    mutationFn: async (email: string) =>
      await inviteUserToGroup(email, Number(groupId)),
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success(tGroupSettingsPage("invite_success"));
      setIsOpen(false);
    },
  });

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <ListTile>
          <UserRoundPlus className="text-primary mr-2" size={16} />
          {tGroupSettingsPage("invite_user")}
        </ListTile>
      </DrawerTrigger>
      <DrawerContent>
        <div className="p-8 overflow-y-scroll">
          <InviteUserToGroupForm
            onSubmit={(values) => mutation.mutate(values.email)}
            isLoading={mutation.isPending}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
