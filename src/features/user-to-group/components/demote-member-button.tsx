"use client";

import { useTranslations } from "next-intl";
import { useAction } from "next-safe-action/hooks";
import { demoteFromAdmin } from "../api";
import { handleResponse } from "@/lib/utils";
import { toast } from "sonner";
import {
  Modal,
  ModalHeader,
  ModalFooter,
  ModalContent,
  ModalBody,
  Button,
  useDisclosure,
} from "@heroui/react";

type Props = {
  userId: number;
  groupId: number;
};

export const DemoteMemberButton = ({ userId, groupId }: Props) => {
  const t = useTranslations();
  const { onOpenChange, isOpen, onOpen, onClose } = useDisclosure();
  const { executeAsync, isPending } = useAction(demoteFromAdmin);

  const handleClick = async () => {
    const res = await executeAsync({
      groupId,
      userId,
    });

    handleResponse({
      t,
      response: res?.data,
      onSuccess() {
        toast.success(t("demoteSuccess"));
        onClose();
      },
      onError(message) {
        toast.error(message);
      },
    });
  };

  return (
    <>
      <Button color="warning" onPress={onOpen}>
        {t("demote")}
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>{t("areYouSure")}</ModalHeader>
          <ModalBody>
            <p>{t("demoteFromAdminWarning")}</p>
          </ModalBody>
          <ModalFooter>
            <Button onPress={onClose}>{t("cancel")}</Button>
            <Button color="warning" onPress={handleClick} isLoading={isPending}>
              {t("continue")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
