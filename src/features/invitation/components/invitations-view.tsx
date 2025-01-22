"use client";

import { handleResponse, isArrayEmpty } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { ListTile } from "@/components/list-tile";
import { useTranslations } from "next-intl";
import { Invitation } from "../types";
import { Group } from "@/features/group/types";
import { EmptyState } from "@/components/empty-state";
import { View } from "@/components/layout/a-new-view";
import { useAction } from "next-safe-action/hooks";
import { acceptInvitation, declineInvitation } from "../api";
import { toast } from "sonner";

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
    <View className="gap-0">
      {invitations.map((invitation) => (
        <ListTile
          key={invitation.invitation.id}
          className="list-tile"
          hideChevron
        >
          <div className="flex-grow flex justify-between items-center">
            <span>{invitation.group.name}</span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleAccept(invitation.invitation.id)}
                disabled={acceptInvitationAction.isPending}
                className="text-primary"
              >
                <Check />
              </button>
              <button
                onClick={() => handleDecline(invitation.invitation.id)}
                disabled={declineInvitationAction.isPending}
                className="text-destructive"
              >
                <X />
              </button>
            </div>
          </div>
        </ListTile>
      ))}
    </View>
  );
};
