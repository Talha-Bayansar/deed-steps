"use client";
import type { User } from "@/auth/models";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useMutation } from "@tanstack/react-query";
import { deleteUserFromGroup } from "../../service";
import { useState } from "react";
import { useGroupById } from "../../hooks/useGroupById";
import { DeleteButton } from "@/components/DeleteButton";
import { View } from "@/components/layout/View";
import { ListTile } from "@/components/ListTile";

type Props = {
  member: User;
  groupId: number;
  isOwner: boolean;
  isLast?: boolean;
};

export const GroupMember = ({
  member,
  groupId,
  isOwner,
  isLast = false,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { refetch } = useGroupById(groupId.toString());
  const mutation = useMutation({
    mutationFn: async () => await deleteUserFromGroup(member.id!, groupId),
    onSuccess: async () => {
      await refetch();
      setIsOpen(false);
    },
  });

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} shouldScaleBackground>
      <DrawerTrigger disabled={!isOwner} asChild>
        <ListTile isClickable={isOwner} withSeparator={!isLast}>
          {member.firstName} {member.lastName}
        </ListTile>
      </DrawerTrigger>
      <DrawerContent>
        <View className="p-4">
          {isOwner && (
            <DeleteButton
              deleteFn={() => mutation.mutate()}
              modalTitle="Are you sure you want to remove this user from the group?"
              modalDescription="This action cannot be undone. This will permanently delete all
          data associated with this user."
            />
          )}
        </View>
      </DrawerContent>
    </Drawer>
  );
};
