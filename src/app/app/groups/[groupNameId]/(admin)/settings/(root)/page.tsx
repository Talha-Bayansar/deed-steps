import { UpdateGroupTile } from "../_components/update-group-tile";
import { DeleteGroup } from "../_components/DeleteGroup";
import { InviteUserTile } from "../_components/invite-user-tile";
import { ManageDeedsTile } from "../_components/manage-deeds-tile";
import { GenerateTransactionLink } from "../_components/GenerateTransactionLink";
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
      {/* <GenerateTransactionLink /> */}
      {/* <DeleteGroup /> */}
    </View>
  );
};

export default GroupSettingsPage;
