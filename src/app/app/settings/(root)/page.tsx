import { View } from "@/components/layout/view";
import { ChangeName } from "../_components/change-name";
import { NotificationsPreference } from "../_components/notifications-preference";
import { requireAuth } from "@/features/auth/api";
import { getLocale } from "@/i18n/api";
import { ChangeLocaleDrawer } from "../_components/change-locale-drawer";
import { SignOutTile } from "../_components/sign-out-tile";
import { getMyPushSubscription } from "@/features/notification/api";

const SettingsRootPage = async () => {
  const user = await requireAuth();
  const locale = await getLocale();
  const pushSubscription = await getMyPushSubscription();

  console.log(pushSubscription);

  return (
    <View className="flex-grow justify-between">
      <View className="gap-0">
        <div className="list-tile flex items-center">
          <ChangeName user={user} />
        </div>
        <div className="list-tile flex items-center">
          <ChangeLocaleDrawer locale={locale} />
        </div>
        <div className="list-tile flex items-center">
          <NotificationsPreference pushScription={pushSubscription.data} />
        </div>
        <div className="list-tile flex items-center">
          <SignOutTile />
        </div>
      </View>
    </View>
  );
};

export default SettingsRootPage;
