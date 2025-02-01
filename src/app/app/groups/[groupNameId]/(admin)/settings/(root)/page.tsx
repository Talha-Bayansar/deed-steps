import { UpdateGroupTile } from "../_components/update-group-tile";
import { DeleteGroupTile } from "../_components/delete-group-tile";
import { InviteUserTile } from "../_components/invite-user-tile";
import { ManageDeedsTile } from "../_components/manage-deeds-tile";
import { TransactionTile } from "../_components/transaction-tile";
import { NotificationPreferencesTile } from "../_components/notification-preferences-tile";
import { View } from "@/components/layout/view";
import { getGroupById } from "@/features/group/api";
import { extractError } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { ErrorState } from "@/components/error-state";

type Props = {
  params: Promise<{
    groupNameId: string;
  }>;
};

const GroupSettingsPage = async ({ params }: Props) => {
  const { groupNameId } = await params;
  const [name, id] = decodeURIComponent(groupNameId).split("_");
  const t = await getTranslations();

  const group = await getGroupById(Number(id));

  const error = extractError(group, t);
  if (error) return <ErrorState error={error} />;

  return (
    <View className="gap-0">
      {group.data!.isOwner && <UpdateGroupTile />}
      <InviteUserTile />
      {group.data!.isOwner && (
        <ManageDeedsTile groupName={name} groupId={Number(id)} />
      )}
      <NotificationPreferencesTile groupId={Number(id)} />
      <TransactionTile groupName={name} groupId={Number(id)} />
      {group.data!.isOwner && <DeleteGroupTile groupId={Number(id)} />}
    </View>
  );
};

export default GroupSettingsPage;
