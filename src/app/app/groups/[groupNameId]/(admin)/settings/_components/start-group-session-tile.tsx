"use client";

import { ListTile } from "@/components/list-tile";
import { startGroupSession } from "@/features/group-session/api";
import { handleResponse } from "@/lib/utils";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

type Props = {
  groupId: number;
};

export const StartGroupSessionTile = ({ groupId }: Props) => {
  const t = useTranslations();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { executeAsync, isPending } = useAction(startGroupSession);

  const handleClick = async () => {
    const res = await executeAsync({
      groupId: groupId,
    });

    handleResponse({
      t,
      response: res?.data,
      onSuccess: () => {
        toast.success(t("groupSessionStarted"));
        onClose();
      },
      onError: (message) => {
        toast.error(message);
      },
    });
  };

  return (
    <>
      <ListTile onPress={onOpen}>
        <Play className="text-primary" />
        {t("startGroupSession")}
      </ListTile>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>{t("areYouSure")}</ModalHeader>
          <ModalBody className="text-sm text-zinc-400">
            {t("startGroupSessionWarning")}
          </ModalBody>
          <ModalFooter>
            <Button onPress={onOpenChange}>{t("cancel")}</Button>
            <Button color="primary" isLoading={isPending} onPress={handleClick}>
              {t("continue")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
