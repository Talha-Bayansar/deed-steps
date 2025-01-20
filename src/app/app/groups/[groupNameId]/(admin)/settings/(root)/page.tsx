import { UpdateGroupTile } from "../_components/update-group-tile";
import { DeleteGroup } from "../_components/DeleteGroup";
import { InviteUserTile } from "../_components/invite-user-tile";
import { ManageDeeds } from "../_components/ManageDeeds";
import { GenerateTransactionLink } from "../_components/GenerateTransactionLink";
import { NotificationPreferences } from "../_components/NotificationPreferences";
import { View } from "@/components/layout/view";

const GroupSettingsPage = () => {
  return (
    <View className="gap-0">
      <UpdateGroupTile />
      <InviteUserTile />
      {/* <ManageDeeds />
      <NotificationPreferences />
      <GenerateTransactionLink />
      <DeleteGroup /> */}
    </View>
  );
};

export default GroupSettingsPage;
