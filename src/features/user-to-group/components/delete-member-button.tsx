"use client";

import { useTranslations } from "next-intl";
import { useAction } from "next-safe-action/hooks";
import { handleResponse } from "@/lib/utils";
import { toast } from "sonner";
import { deleteUserFromGroup } from "@/features/user-to-group/api";
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
  groupId: number;
  userId: number;
};

export const DeleteMemberButton = ({ groupId, userId }: Props) => {
  const t = useTranslations();
  const { onOpenChange, isOpen, onOpen, onClose } = useDisclosure();
  const { executeAsync, isPending } = useAction(deleteUserFromGroup);

  const handleDelete = async () => {
    const res = await executeAsync({
      userId,
      groupId,
    });

    handleResponse({
      t,
      response: res?.data,
      onSuccess() {
        toast.success(t("deleteSuccess"));
        onClose();
      },
      onError(message) {
        toast.error(message);
      },
    });
  };

  return (
    <>
      <Button color="danger" onPress={onOpen}>
        {t("delete")}
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>{t("areYouSure")}</ModalHeader>
          <ModalBody>
            <p>{t("deleteWarning")}</p>
          </ModalBody>
          <ModalFooter>
            <Button onPress={onClose}>{t("cancel")}</Button>
            <Button color="danger" onPress={handleDelete} isLoading={isPending}>
              {t("continue")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
