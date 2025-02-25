"use client";

import { ListTile } from "@/components/list-tile";
import { EndGroupSessionForm } from "@/features/group-session/components/end-group-session-form";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import { StopCircle } from "lucide-react";
type Props = {
  groupSessionId: number;
};

export const EndGroupSessionTile = ({ groupSessionId }: Props) => {
  const t = useTranslations();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <>
      <ListTile onPress={onOpen}>
        <StopCircle className="text-primary" />
        {t("endGroupSession")}
      </ListTile>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          <ModalHeader>{t("endGroupSession")}</ModalHeader>
          <ModalBody className="text-sm text-zinc-400">
            {t("endGroupSessionWarning")}
          </ModalBody>
          <ModalFooter>
            <EndGroupSessionForm
              onSuccess={onClose}
              groupSessionId={groupSessionId}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
