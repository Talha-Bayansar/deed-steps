"use client";

import { routes } from "@/lib/routes";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAction } from "next-safe-action/hooks";
import { deleteDeedTemplateById } from "@/features/deed-template/api";
import { handleResponse } from "@/lib/utils";
import { toast } from "sonner";
import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { IconButton } from "@/components/icon-buttons";
import { Trash2 } from "lucide-react";

type Props = {
  deedTemplateId: number;
  groupId: number;
  groupName: string;
};

export const DeleteDeedTemplate = ({
  deedTemplateId,
  groupId,
  groupName,
}: Props) => {
  const t = useTranslations();
  const router = useRouter();
  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();

  const { executeAsync, isPending } = useAction(deleteDeedTemplateById);

  const handleDelete = async () => {
    const res = await executeAsync({
      id: deedTemplateId,
    });

    handleResponse({
      t,
      response: res?.data,
      onSuccess: () => {
        onClose();
        toast.success(t("deleteSuccess"));
        router.push(
          routes.groups.nameId(groupName, groupId).deedTemplates.root
        );
      },
      onError(message) {
        toast.error(message);
      },
    });
  };

  return (
    <>
      <IconButton Icon={Trash2} color="danger" onPress={onOpen} />

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>{t("areYouSure")}</ModalHeader>
          <Divider />
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
