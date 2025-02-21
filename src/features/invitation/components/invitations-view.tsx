"use client";

import { handleResponse, isArrayEmpty } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { ListTile } from "@/components/list-tile";
import { useTranslations } from "next-intl";
import { Invitation } from "../types";
import { Group } from "@/features/group/types";
import { EmptyState } from "@/components/empty-state";
import { View } from "@/components/layout/view";
import { useAction } from "next-safe-action/hooks";
import { acceptInvitation, declineInvitation } from "../api";
import { toast } from "sonner";
import { IconButton } from "@/components/icon-buttons";

type Props = {
  invitations: {
    invitation: Invitation;
    group: Group;
  }[];
};

export const InvitationsView = ({ invitations }: Props) => {
  const t = useTranslations();
  const acceptInvitationAction = useAction(acceptInvitation);
  const declineInvitationAction = useAction(declineInvitation);

  const handleAccept = async (id: number) => {
    const res = await acceptInvitationAction.executeAsync({
      id,
    });

    handleResponse({
      t,
      response: res?.data,
      onSuccess() {
        toast.success(t("acceptSuccess"));
      },
      onError(message) {
        toast.error(message);
      },
    });
  };

  const handleDecline = async (id: number) => {
    const res = await declineInvitationAction.executeAsync({
      id,
    });

    handleResponse({
      t,
      response: res?.data,
      onSuccess() {
        toast.success(t("declineSuccess"));
      },
      onError(message) {
        toast.error(message);
      },
    });
  };

  if (isArrayEmpty(invitations))
    return (
      <EmptyState
        title={t("emptyWarning")}
        description={t("emptyWarningAction")}
      />
    );

  return (
    <View className="gap-2">
      {invitations.map((invitation) => (
        <ListTile
          key={invitation.invitation.id}
          className="h-auto pr-1"
          as="div"
          hideChevron
          disableAnimation
          disableRipple
        >
          <div className="flex-grow flex justify-between items-center">
            <span>{invitation.group.name}</span>
            <div className="flex items-center">
              <IconButton
                onPress={() => handleAccept(invitation.invitation.id)}
                isLoading={acceptInvitationAction.isPending}
                Icon={Check}
              />
              <IconButton
                onPress={() => handleDecline(invitation.invitation.id)}
                isLoading={declineInvitationAction.isPending}
                Icon={X}
                color="danger"
              />
            </div>
          </div>
        </ListTile>
      ))}
    </View>
  );
};
