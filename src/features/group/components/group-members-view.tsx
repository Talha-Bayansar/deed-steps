"use client";

import { User } from "@/features/auth/types";
import { Group, GroupPoints } from "../types";
import { isArrayEmpty } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { EmptyState } from "@/components/empty-state";
import { View } from "@/components/layout/view";
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
import { GroupAdmin } from "@/features/group-admin/types";
import { PromoteToAdminAlertDialog } from "@/features/group-admin/components/promote-to-admin-alert-dialog";
import { DemoteFromAdminAlertDialog } from "@/features/group-admin/components/demote-from-admin-alert-dialog";

type Props = {
  group: Group;
  members: User[];
  points: GroupPoints[];
  isOwner?: boolean;
  isAdmin?: boolean;
  groupAdmins: GroupAdmin[];
};

export const GroupMembersView = ({
  group,
  members,
  points,
  isOwner = false,
  isAdmin = false,
  groupAdmins,
}: Props) => {
  const t = useTranslations();
  const hasPermission = isOwner || isAdmin;
  const ownerOnly = isOwner;

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
          <DrawerTrigger
            disabled={!hasPermission || group.ownerId === member.id}
            className="list-tile"
          >
            <ListTile
              hideChevron={!hasPermission || group.ownerId === member.id}
            >
              <View className="items-start gap-0">
                <div>
                  {member.firstName} {member.lastName}
                </div>
                {hasPermission && (
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
              {ownerOnly &&
                (groupAdmins.some((ga) => ga.userId === member.id) ? (
                  <DemoteFromAdminAlertDialog
                    userId={member.id}
                    groupId={group.id}
                  >
                    <Button variant={"outline"}>{t("demote")}</Button>
                  </DemoteFromAdminAlertDialog>
                ) : (
                  <PromoteToAdminAlertDialog
                    userId={member.id}
                    groupId={group.id}
                  >
                    <Button>{t("promote")}</Button>
                  </PromoteToAdminAlertDialog>
                ))}
              {hasPermission && (
                <DeleteMemberAlertDialog groupId={group.id} userId={member.id}>
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
