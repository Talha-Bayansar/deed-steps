"use client";

import { useTranslations } from "next-intl";
import { useAction } from "next-safe-action/hooks";
import { handleResponse } from "@/lib/utils";
import { toast } from "sonner";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { deleteDeedStatusById } from "../api";

type Props = {
  deedStatusId: number;
};

export const DeleteDeedStatusButton = ({ deedStatusId }: Props) => {
  const t = useTranslations();
  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();

  const { executeAsync, isPending } = useAction(deleteDeedStatusById);

  const handleDelete = async () => {
    const res = await executeAsync({ id: deedStatusId });

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
          <ModalBody className="text-sm text-zinc-400">
            {t("deleteWarning")}
          </ModalBody>
          <ModalFooter>
            <Button onPress={onOpenChange}>{t("cancel")}</Button>
            <Button color="danger" isLoading={isPending} onPress={handleDelete}>
              {t("continue")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
