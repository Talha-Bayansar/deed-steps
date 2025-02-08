"use client";
import { registerPushNotifications } from "@/features/notification/services/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode;
};

const queryClient = new QueryClient();

export const ReactQueryProvider = ({ children }: Props) => {
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          registerPushNotifications();
        }
      });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
