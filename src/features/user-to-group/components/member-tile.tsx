"use client";

import { UserToGroup } from "../types";
import { User } from "@/features/auth/types";
import { View } from "@/components/layout/view";
import { GroupPoints } from "@/features/group/types";
import { useTranslations } from "next-intl";
import { Coins, UserCog } from "lucide-react";
import { hasGroupPermission } from "../access-control/permissions";
import { ListTile } from "@/components/list-tile";
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { DeleteMemberButton } from "./delete-member-button";
import { DemoteMemberButton } from "./demote-member-button";
import { PromoteMemberButton } from "./promote-member-button";
type Props = {
  member: { user_to_group: UserToGroup; user: User };
  groupPoints: GroupPoints;
  currentUserToGroup: UserToGroup;
};

export const MemberTile = ({
  member,
  groupPoints,
  currentUserToGroup,
}: Props) => {
  const t = useTranslations();
  const { onOpenChange, isOpen, onOpen } = useDisclosure();

  const hasEditPermission = hasGroupPermission(
    currentUserToGroup,
    "member:edit"
  );
  const hasPointsPermission = hasGroupPermission(
    currentUserToGroup,
    "memberPoints:read"
  );
  const hasDeletePermission = hasGroupPermission(
    currentUserToGroup,
    "member:delete"
  );

  return (
    <>
      <ListTile
        disableAnimation={!hasEditPermission}
        disableRipple={!hasEditPermission}
        hideChevron={!hasEditPermission}
        onPress={hasEditPermission ? onOpen : undefined}
        className="h-auto text-left p-3"
      >
        <View className="gap-1">
          <span className="text-lg font-medium">
            {member.user.firstName} {member.user.lastName}
          </span>
          <span className="flex items-center gap-1 text-xs text-zinc-400">
            <UserCog className="text-primary w-4 h-4" />{" "}
            {t(member.user_to_group.role)}
          </span>
        </View>
        {hasPointsPermission && (
          <span className="flex items-center gap-1 text-zinc-400">
            <Coins className="text-yellow-500 w-5 h-5" />{" "}
            <span className="font-medium">
              {groupPoints.points}
              <span className="text-xs font-normal">
                /{groupPoints.totalPoints}
              </span>
            </span>
          </span>
        )}
      </ListTile>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>
            {member.user.firstName} {member.user.lastName}
          </ModalHeader>
          <ModalFooter>
            {hasEditPermission && (
              <>
                {member.user_to_group.role === "admin" && (
                  <DemoteMemberButton
                    userId={member.user.id}
                    groupId={currentUserToGroup.groupId}
                  />
                )}
                {member.user_to_group.role === "member" && (
                  <PromoteMemberButton
                    userId={member.user.id}
                    groupId={currentUserToGroup.groupId}
                  />
                )}
              </>
            )}

            {hasDeletePermission && member.user_to_group.role !== "owner" && (
              <DeleteMemberButton
                groupId={currentUserToGroup.groupId}
                userId={member.user.id}
              />
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
