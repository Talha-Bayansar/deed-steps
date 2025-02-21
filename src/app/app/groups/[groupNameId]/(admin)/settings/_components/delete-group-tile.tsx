"use client";

import { deleteGroup } from "@/features/group/api";
import { routes } from "@/lib/routes";
import { useTranslations } from "next-intl";
import { Trash2 } from "lucide-react";
import { ListTile } from "@/components/list-tile";
import { useAction } from "next-safe-action/hooks";
import { handleResponse } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";

type Props = {
  groupId: number;
};

export const DeleteGroupTile = ({ groupId }: Props) => {
  const t = useTranslations();
  const router = useRouter();
  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();

  const { executeAsync, isPending } = useAction(deleteGroup);

  const handleDelete = async () => {
    const res = await executeAsync({
      id: groupId,
    });

    handleResponse({
      t,
      response: res?.data,
      onSuccess: () => {
        onClose();
        router.push(routes.groups.root);
      },
      onError(message) {
        toast.error(message);
      },
    });
  };

  return (
    <>
      <ListTile onPress={onOpen} className="text-danger-400">
        <Trash2 />
        {t("deleteGroup")}
      </ListTile>

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
