"use client";

import { ListTile } from "@/components/list-tile";
import {
  registerPushNotifications,
  unregisterPushNotifications,
} from "@/features/notification/services/notifications";
import { Bell } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { PushSubscription } from "@/features/notification/types";
import { Switch } from "@heroui/react";

type Props = {
  pushScription?: PushSubscription | null;
};

export const NotificationsPreference = ({ pushScription }: Props) => {
  const t = useTranslations();
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    setIsAllowed(
      (Notification.permission === "granted" && !!pushScription) ?? false
    );
  }, []);

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
    <ListTile as="div" disableAnimation disableRipple hideChevron>
      <div className="flex flex-grow items-center justify-between">
        <span className="flex items-center gap-2">
          <Bell className="text-primary" /> {t("allowNotifications")}
        </span>
        <Switch onValueChange={handleCheck} isSelected={isAllowed} />
      </div>
    </ListTile>
  );
};
