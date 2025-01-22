import { UpdateGroupTile } from "../_components/update-group-tile";
import { DeleteGroupTile } from "../_components/delete-group-tile";
import { InviteUserTile } from "../_components/invite-user-tile";
import { ManageDeedsTile } from "../_components/manage-deeds-tile";
import { TransactionTile } from "../_components/transaction-tile";
import { NotificationPreferencesTile } from "../_components/notification-preferences-tile";
import { View } from "@/components/layout/view";

type Props = {
  params: Promise<{
    groupNameId: string;
  }>;
};

const GroupSettingsPage = async ({ params }: Props) => {
  const { groupNameId } = await params;
  const [name, id] = decodeURIComponent(groupNameId).split("_");

  return (
    <View className="gap-0">
      <UpdateGroupTile />
      <InviteUserTile />
      <ManageDeedsTile groupName={name} groupId={Number(id)} />
      <NotificationPreferencesTile groupId={Number(id)} />
      <TransactionTile groupName={name} groupId={Number(id)} />
      <DeleteGroupTile groupId={Number(id)} />
    </View>
  );
};

export default GroupSettingsPage;
