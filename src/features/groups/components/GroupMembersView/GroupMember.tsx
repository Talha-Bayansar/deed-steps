"use client";
import type { User } from "@/features/auth/models";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useMutation } from "@tanstack/react-query";
import { deleteUserFromGroup } from "../../actions/groups";
import { useState } from "react";
import { useGroupById } from "../../hooks/useGroupById";
import { DestructiveModalButton } from "@/components/DestructiveModalButton";
import { View } from "@/components/layout/View";
import { ListTile } from "@/components/ListTile";
import { useTranslations } from "next-intl";
import type { GroupPoints } from "@/features/groups/models";

type Props = {
  member: User & {
    groupPoints: GroupPoints[];
  };
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
  const t = useTranslations("global");
  const tGroupDetailsPage = useTranslations("GroupDetailsPage");
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
      <DrawerTrigger asChild>
        <ListTile isClickable={isOwner} withSeparator={!isLast}>
          <View className="items-start gap-0">
            <div>
              {member.firstName} {member.lastName}
            </div>
            {isOwner && (
              <div className="text-xs text-gray-400">
                {t("points")}: {member.groupPoints[0].points}
              </div>
            )}
          </View>
        </ListTile>
      </DrawerTrigger>
      <DrawerContent>
        <View className="p-8 overflow-y-scroll">
          {isOwner && (
            <DestructiveModalButton
              onContinue={() => mutation.mutate()}
              title={tGroupDetailsPage("delete_modal_title")}
              description={tGroupDetailsPage("delete_modal_description")}
            />
          )}
        </View>
      </DrawerContent>
    </Drawer>
  );
};
