"use client";

import { CreateDeedStatusForm } from "@/features/deed-status/components/create-deed-status-form";
import { useTranslations } from "next-intl";
import {
  Divider,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { AddIconButton } from "@/components/icon-buttons/plus-icon-button";

type Props = {
  deedTemplateId: number;
};

export const CreateDeedStatus = ({ deedTemplateId }: Props) => {
  const t = useTranslations();
  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();

  return (
    <>
      <AddIconButton onPress={onOpen} />

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>{t("createDeedStatus")}</ModalHeader>
          <Divider />
          <ModalFooter>
            <CreateDeedStatusForm
              deedTemplateId={deedTemplateId}
              onSuccess={onClose}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
