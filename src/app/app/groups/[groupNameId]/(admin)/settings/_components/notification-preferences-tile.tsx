"use client";

import { ListTile } from "@/components/list-tile";
import {
  sendReminderNotification,
  updateGroupById,
} from "@/features/group/api";
import { Bell, BellRing, ListChecks } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import { handleResponse } from "@/lib/utils";
import { View } from "@/components/layout/view";
import {
  Divider,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Switch,
  useDisclosure,
} from "@heroui/react";

type Props = {
  groupId: number;
  notifyDeeds: boolean;
};

export const NotificationPreferencesTile = ({
  groupId,
  notifyDeeds,
}: Props) => {
  const t = useTranslations();
  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  const [isChecked, setIsChecked] = useState(notifyDeeds);

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
    <>
      <ListTile onPress={onOpen}>
        <Bell className="text-primary" />
        {t("notificationPreferences")}
      </ListTile>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>{t("notificationPreferences")}</ModalHeader>
          <Divider />
          <ModalFooter>
            <View className="gap-2">
              <ListTile onPress={sendReminder}>
                <BellRing className="text-primary" />
                {t("sendReminder")}
              </ListTile>

              <ListTile disableAnimation disableRipple hideChevron>
                <div className="flex flex-grow justify-between items-center">
                  <div className="flex gap-2">
                    <ListChecks className="text-primary" />
                    {t("notifyEveryDeed")}
                  </div>
                  <Switch isSelected={isChecked} onValueChange={handleCheck} />
                </div>
              </ListTile>
            </View>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
