"use client";

import { User } from "@/features/auth/types";
import { GroupPoints } from "../types";
import { isArrayEmpty } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { EmptyState } from "@/components/empty-state";
import { View } from "@/components/layout/a-new-view";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ListTile } from "@/components/list-tile";
import { DeleteMemberAlertDialog } from "./delete-member-alert-dialog";
import { Button } from "@/components/ui/button";

type Props = {
  groupId: number;
  members: User[];
  points: GroupPoints[];
  isOwner?: boolean;
};

export const GroupMembersView = ({
  groupId,
  members,
  points,
  isOwner = false,
}: Props) => {
  const t = useTranslations();

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
        <Drawer key={member.id}>
          <DrawerTrigger disabled={!isOwner} className="list-tile">
            <ListTile hideChevron={!isOwner}>
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
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>
                {`${member.firstName} ${member.lastName}`}
              </DrawerTitle>
            </DrawerHeader>
            <DrawerFooter>
              {isOwner && (
                <DeleteMemberAlertDialog groupId={groupId} userId={member.id}>
                  <Button variant="destructive">{t("delete")}</Button>
                </DeleteMemberAlertDialog>
              )}
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ))}
    </View>
  );
};
