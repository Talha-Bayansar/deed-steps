"use client";

import { ListTile } from "@/components/list-tile";
import {
  sendReminderNotification,
  updateGroupById,
} from "@/features/group/api";
import { Bell, BellRing, ListChecks, Timer } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import { handleResponse } from "@/lib/utils";
import { View } from "@/components/layout/view";
import {
  Card,
  CardFooter,
  CardHeader,
  Divider,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Switch,
  useDisclosure,
} from "@heroui/react";
import { UpdateNotificationDelayForm } from "@/features/group/components/update-notification-delay-form";
import { Group } from "@/features/group/types";

type Props = {
  group: Group;
};

export const NotificationPreferencesTile = ({ group }: Props) => {
  const t = useTranslations();
  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  const [isChecked, setIsChecked] = useState(group.notifyDeeds);

  const sendReminderAction = useAction(sendReminderNotification);
  const updateGroupAction = useAction(updateGroupById);

  const sendReminder = async () => {
    const res = await sendReminderAction.executeAsync({
      title: t("reminderTitle"),
      body: t("reminderBody"),
      groupId: group.id,
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
      groupId: group.id,
      notifyDeeds: value,
    });
    setIsChecked(value);
  };

  return (
    <>
      <ListTile onPress={onOpen}>
        <Bell className="text-primary" />
        {t("notificationPreferences")}
      </ListTile>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          <ModalHeader>{t("notificationPreferences")}</ModalHeader>
          <Divider />
          <ModalFooter>
            <View className="gap-2">
              <ListTile onPress={sendReminder}>
                <BellRing className="text-primary" />
                {t("sendReminder")}
              </ListTile>

              <Card className="bg-default-100 border-default border-medium">
                <CardHeader>
                  <div className="flex gap-2 items-center">
                    <ListChecks className="text-primary" />
                    {t("notifyEveryDeed")}
                  </div>
                </CardHeader>
                <Divider />
                <CardFooter>
                  <Switch isSelected={isChecked} onValueChange={handleCheck} />
                </CardFooter>
              </Card>
              <Card className="bg-default-100 border-default border-medium">
                <CardHeader>
                  <div className="flex gap-2 items-center">
                    <Timer className="text-primary" />
                    {t("notificationDelay")}{" "}
                    <span className="text-sm text-zinc-400">
                      ({t("minutes")})
                    </span>
                  </div>
                </CardHeader>
                <Divider />
                <CardFooter>
                  <UpdateNotificationDelayForm group={group} />
                </CardFooter>
              </Card>
            </View>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
