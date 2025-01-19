"use client";

import { User } from "@/features/auth/types";
import { GroupPoints } from "../types";
import { isArrayEmpty } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { EmptyState } from "@/components/empty-state";
import { View } from "@/components/layout/view";
import { useState } from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ListTile } from "@/components/list-tile";

type Props = {
  members: User[];
  points: GroupPoints[];
  isOwner?: boolean;
};

export const GroupMembersView = ({
  members,
  points,
  isOwner = false,
}: Props) => {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);

  //   const mutation = useMutation({
  //     mutationFn: async () => await deleteUserFromGroup(member.id!, groupId),
  //     onSuccess: async () => {
  //       await refetch();
  //       setIsOpen(false);
  //     },
  //   });

  if (isArrayEmpty(members))
    return (
      <EmptyState
        title={t("emptyWarning")}
        description={t("emptyWarningAction")}
      />
    );

  return (
    <View className="gap-0">
      {members.map((member) => (
        <Drawer open={isOpen} onOpenChange={setIsOpen} shouldScaleBackground>
          <DrawerTrigger>
            <ListTile className="list-tile">
              <View className="items-start gap-0">
                <div>
                  {member.firstName} {member.lastName}
                </div>
                {isOwner && (
                  <div className="text-xs text-muted-foreground">
                    {t("points")}:{" "}
                    {points.find((p) => p.userId === member.id)?.points}
                  </div>
                )}
              </View>
            </ListTile>
          </DrawerTrigger>
          <DrawerContent>test</DrawerContent>
        </Drawer>
      ))}
    </View>
  );
};
