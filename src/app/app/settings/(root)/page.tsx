import { View } from "@/components/layout/view";
import { ChangeName } from "../_components/change-name";
import { NotificationsPreference } from "../_components/notifications-preference";
import { requireAuth } from "@/features/auth/api";
import { getLocale } from "@/i18n/api";
import { ChangeLocaleDrawer } from "../_components/change-locale-drawer";
import { SignOutTile } from "../_components/sign-out-tile";
import { getMyPushSubscription } from "@/features/notification/api";
import { MySubscriptionTile } from "../_components/my-subscription-tile";
const SettingsRootPage = async () => {
  const user = await requireAuth();
  const locale = await getLocale();
  const pushSubscription = await getMyPushSubscription();

  return (
    <View className="flex-grow justify-between">
      <View className="gap-2">
        <ChangeName user={user} />
        <ChangeLocaleDrawer locale={locale} />
        <NotificationsPreference pushScription={pushSubscription.data} />
        <MySubscriptionTile />
        <SignOutTile />
      </View>
    </View>
  );
};

export default SettingsRootPage;
