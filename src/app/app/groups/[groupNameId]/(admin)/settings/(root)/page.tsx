import { ChangeName } from "../_components/ChangeName";
import { DeleteGroup } from "../_components/DeleteGroup";
import { InviteUser } from "../_components/InviteUser";
import { ManageDeeds } from "../_components/ManageDeeds";
import { GenerateTransactionLink } from "../_components/GenerateTransactionLink";
import { NotificationPreferences } from "../_components/NotificationPreferences";
import { View } from "@/components/layout/view";

type Props = {
  params: Promise<{
    groupId: string;
  }>;
};

const Page = async (props: Props) => {
  return (
    <View className="gap-0">
      {/* <ChangeName />
      <InviteUser />
      <ManageDeeds />
      <NotificationPreferences />
      <GenerateTransactionLink />
      <DeleteGroup /> */}
    </View>
  );
};

export default Page;
