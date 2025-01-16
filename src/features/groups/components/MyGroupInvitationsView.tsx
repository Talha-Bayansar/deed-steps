"use client";
import { View } from "@/components/layout/ror";
import { useMyGroupInvitations } from "../hooks/useMyGroupInvitations";
import { generateArray, isArrayEmpty } from "@/lib/utils";
import { EmptyView } from "@/components/EmptyView";
import { Check, Inbox, X } from "lucide-react";
import { ListTile, ListTileSkeleton } from "@/components/list-tile";
import { IconButton } from "@/components/IconButton";
import { useMutation } from "@tanstack/react-query";
import { acceptInvitation, declineInvitation } from "../actions/groups";
import { useTranslations } from "next-intl";

export const MyGroupInvitationsView = () => {
  const tInvitationsPage = useTranslations("InvitationsPage");
  const { data, isLoading, refetch } = useMyGroupInvitations();
  const acceptInvitationMutation = useMutation({
    mutationFn: async (id: number) => await acceptInvitation(id),
    onSuccess: async () => {
      await refetch();
    },
  });
  const declineInvitationMutation = useMutation({
    mutationFn: async (id: number) => await declineInvitation(id),
    onSuccess: async () => {
      await refetch();
    },
  });

  if (isLoading) return <MyGroupInvitationsViewSkeleton />;

  if (!data || isArrayEmpty(data))
    return (
      <EmptyView Icon={Inbox} message={tInvitationsPage("no_invitations")} />
    );

  return (
    <View>
      {data.map((invitation) => (
        <ListTile key={invitation.id} isClickable={false}>
          <div className="flex-grow flex justify-between items-center">
            <span>{invitation.group.name}</span>
            <div className="flex items-center gap-4">
              <IconButton
                onClick={() => acceptInvitationMutation.mutate(invitation.id)}
                disabled={acceptInvitationMutation.isPending}
                className="p-0"
              >
                <Check className="text-primary" size={20} />
              </IconButton>
              <IconButton
                onClick={() => declineInvitationMutation.mutate(invitation.id)}
                disabled={declineInvitationMutation.isPending}
                className="p-0"
              >
                <X className="text-destructive" size={20} />
              </IconButton>
            </div>
          </div>
        </ListTile>
      ))}
    </View>
  );
};

const MyGroupInvitationsViewSkeleton = () => {
  return (
    <View>
      {generateArray(6).map((item) => (
        <ListTileSkeleton key={item} />
      ))}
    </View>
  );
};
