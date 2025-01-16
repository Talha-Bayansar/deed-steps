"use client";

import { useSession } from "@/features/auth/hooks/useSession";
import { ListTile } from "@/components/list-tile";
import { View } from "@/components/layout/ror";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Switch } from "@/components/ui/switch";
import { useGroupById } from "@/features/groups/hooks/useGroupById";
import {
  sendReminderNotification,
  updateGroup,
} from "@/features/groups/actions/groups";
import { useMutation } from "@tanstack/react-query";
import { Bell, BellRing, ListChecks } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const NotificationPreferences = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { data: group, isLoading: isGroupLoading } = useGroupById(groupId);
  const [isOpen, setIsOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(
    group?.hasDeedNotifications ?? false
  );
  const { data: session } = useSession();
  const tMessages = useTranslations("global.messages");
  const tGroupSettingsPage = useTranslations("GroupSettingsPage");
  const sendReminderMutation = useMutation({
    mutationFn: async () =>
      await sendReminderNotification({
        title: tMessages("reminder_title"),
        body: tMessages("reminder_body"),
        userId: session!.user!.id,
        groupId: Number(groupId),
      }),
    onSuccess: () => {
      toast.success(tGroupSettingsPage("send_reminder_success"));
    },
    onError: () => {
      toast.success(tGroupSettingsPage("send_reminder_error"));
    },
  });
  const updateGroupMutation = useMutation({
    mutationFn: async (value: boolean) =>
      await updateGroup(Number(groupId), { hasDeedNotifications: value }),
  });
  const handleCheck = (value: boolean) => {
    updateGroupMutation.mutate(value);
    setIsChecked(value);
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <ListTile>
          <div className="flex items-center gap-2">
            <Bell className="text-primary" size={16} />
            {tGroupSettingsPage("notification_preferences")}
          </div>
        </ListTile>
      </DrawerTrigger>
      <DrawerContent>
        <View className="p-8 gap-0 overflow-y-scroll">
          <ListTile onClick={() => sendReminderMutation.mutate()}>
            <div className="flex items-center gap-2">
              <BellRing className="text-primary" size={16} />
              {tGroupSettingsPage("send_reminder")}
            </div>
          </ListTile>
          <ListTile isClickable={false}>
            <div className="flex flex-grow justify-between items-center">
              <div className="flex items-center gap-2">
                <ListChecks className="text-primary" size={16} />
                {tGroupSettingsPage("send_notification_deeds")}
              </div>
              <Switch
                disabled={isGroupLoading}
                checked={isChecked}
                onCheckedChange={handleCheck}
              />
            </div>
          </ListTile>
        </View>
      </DrawerContent>
    </Drawer>
  );
};
