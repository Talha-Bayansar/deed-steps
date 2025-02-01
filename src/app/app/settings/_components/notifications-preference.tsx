"use client";

import { ListTile } from "@/components/list-tile";
import { Switch } from "@/components/ui/switch";
import {
  registerPushNotifications,
  unregisterPushNotifications,
} from "@/features/notification/services/notifications";
import { Bell } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { PushSubscription } from "@/features/notification/types";

type Props = {
  pushScription?: PushSubscription | null;
};

export const NotificationsPreference = ({ pushScription }: Props) => {
  const t = useTranslations();
  const [isAllowed, setIsAllowed] = useState(
    (Notification.permission === "granted" && !!pushScription) ?? false
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
