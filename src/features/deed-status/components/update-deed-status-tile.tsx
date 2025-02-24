"use client";

import { DeedStatusTile } from "@/features/deed-status/components/deed-status-tile";
import { useTranslations } from "next-intl";
import { DeedStatus } from "@/features/deed-status/types";
import { UpdateDeedStatusForm } from "@/features/deed-status/components/update-deed-status-form";
import { DeleteDeedStatusButton } from "@/features/deed-status/components/delete-deed-status-button";
import { View } from "@/components/layout/view";
import {
  Divider,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";

type Props = {
  status: DeedStatus;
};

export const UpdateDeedStatusTile = ({ status }: Props) => {
  const t = useTranslations();
  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();

  return (
    <>
      <DeedStatusTile status={status} onPress={onOpen} />

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          <ModalHeader>{status.name}</ModalHeader>
          <Divider />
          <ModalFooter>
            <View className="gap-2">
              <UpdateDeedStatusForm deedStatus={status} onSuccess={onClose} />
              <DeleteDeedStatusButton deedStatusId={status.id} />
            </View>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
