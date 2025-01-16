"use client";

import { ListTile } from "@/components/list-tile";
import { Switch } from "@/components/ui/switch";
import {
  registerPushNotifications,
  unregisterPushNotifications,
} from "@/features/notifications/services/notifications";
import { Bell } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export const NotificationsPreference = () => {
  const t = useTranslations();
  const [isAllowed, setIsAllowed] = useState(
    Notification.permission === "granted" &&
      !!localStorage.getItem("notifications-allowed")
      ? true
      : false
  );

  async function handleCheck(value: boolean) {
    if (value) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          setIsAllowed(value);
          localStorage.setItem("notifications-allowed", "true");
          registerPushNotifications();
        }
      });
    } else {
      setIsAllowed(value);
      localStorage.setItem("notifications-allowed", "false");
      unregisterPushNotifications();
    }
  }

  return (
    <ListTile hideChevron>
      <div className="flex flex-grow items-center justify-between">
        <span className="flex items-center gap-2">
          <Bell className="text-primary" /> {t("allowNotifications")}
        </span>
        <Switch onCheckedChange={handleCheck} checked={isAllowed} />
      </div>
    </ListTile>
  );
};
