"use client";

import { useEffect } from "react";
import { registerPushNotifications } from "../services/notifications";

type Props = {
  children: React.ReactNode;
};

export const NotificationPermissionWrapper = ({ children }: Props) => {
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          registerPushNotifications();
        }
      });
    }
  }, []);

  return children;
};
