import { View } from "@/components/layout/view";
import { ChangeName } from "../_components/change-name";
import { NotificationsPreference } from "../_components/notifications-preference";
import { requireAuth } from "@/features/auth/api";
import { getLocale } from "@/i18n/api";
import { ChangeLocaleDrawer } from "../_components/change-locale-drawer";
import { SignOutAlertDialog } from "@/features/auth/components/sign-out-alert-dialog";
import { Button } from "@/components/ui/button";
import { getTranslations } from "next-intl/server";

const SettingsRootPage = async () => {
  const t = await getTranslations();
  const user = await requireAuth();
  const locale = await getLocale();

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
          <NotificationsPreference />
        </div>
      </View>
      <SignOutAlertDialog>
        <Button variant={"destructive"}>{t("signOut")}</Button>
      </SignOutAlertDialog>
    </View>
  );
};

export default SettingsRootPage;
