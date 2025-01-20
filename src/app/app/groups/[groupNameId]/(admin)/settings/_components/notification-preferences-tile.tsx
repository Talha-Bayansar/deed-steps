"use client";

import { ListTile } from "@/components/list-tile";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Switch } from "@/components/ui/switch";
import { useGroupById } from "@/features/group/hooks/useGroupById";
import {
  sendReminderNotification,
  updateGroupById,
} from "@/features/group/api";
import { Bell, BellRing, ListChecks } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { View } from "@/components/layout/view";
import { useAction } from "next-safe-action/hooks";
import { handleResponse } from "@/lib/utils";

type Props = {
  groupId: number;
};

export const NotificationPreferencesTile = ({ groupId }: Props) => {
  const t = useTranslations();
  const { data: group, isLoading: isGroupLoading } = useGroupById(groupId);
  const [isOpen, setIsOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(group?.data?.notifyDeeds ?? false);

  const sendReminderAction = useAction(sendReminderNotification);
  const updateGroupAction = useAction(updateGroupById);

  const sendReminder = async () => {
    const res = await sendReminderAction.executeAsync({
      title: t("reminderTitle"),
      body: t("reminderBody"),
      groupId: groupId,
    });
    handleResponse({
      t,
      response: res?.data,
      onSuccess() {
        toast.success(t("sendReminderSuccess"));
      },
      onError(message) {
        toast.error(message);
      },
    });
  };

  const handleCheck = (value: boolean) => {
    updateGroupAction.execute({
      groupId,
      notifyDeeds: value,
    });
    setIsChecked(value);
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger className="list-tile">
        <ListTile>
          <Bell className="text-primary" />
          {t("notificationPreferences")}
        </ListTile>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{t("notificationPreferences")}</DrawerTitle>
        </DrawerHeader>
        <DrawerFooter>
          <View className="gap-0">
            <button className="list-tile" onClick={sendReminder}>
              <ListTile>
                <BellRing className="text-primary" />
                {t("sendReminder")}
              </ListTile>
            </button>
            <ListTile className="list-tile" hideChevron>
              <div className="flex flex-grow justify-between items-center">
                <div className="flex gap-2">
                  <ListChecks className="text-primary" />
                  {t("notifyEveryDeed")}
                </div>
                <Switch
                  disabled={isGroupLoading}
                  checked={isChecked}
                  onCheckedChange={handleCheck}
                />
              </div>
            </ListTile>
          </View>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
