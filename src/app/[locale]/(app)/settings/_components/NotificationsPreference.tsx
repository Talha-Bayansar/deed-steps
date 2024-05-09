"use client";

import { ListTile } from "@/components/ListTile";
import { Switch } from "@/components/ui/switch";
import {
  registerPushNotifications,
  unregisterPushNotifications,
} from "@/notifications/service";
import { Bell } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export const NotificationsPreference = () => {
  const t = useTranslations("SettingsPage");
  const [isAllowed, setIsAllowed] = useState(
    Notification.permission === "granted" ? true : false
  );

  async function handleCheck(value: boolean) {
    if (value) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          setIsAllowed(value);
          registerPushNotifications();
        }
      });
    } else {
      setIsAllowed(value);
      unregisterPushNotifications();
    }
  }

  return (
    <ListTile isClickable={false}>
      <div className="flex flex-grow items-center justify-between">
        <span className="flex items-center gap-2">
          <Bell size={16} className="text-primary" /> {t("allow_notifications")}
        </span>
        <Switch onCheckedChange={handleCheck} checked={isAllowed} />
      </div>
    </ListTile>
  );
};
