"use client";

import { ListTile } from "@/components/list-tile";
import { Pen } from "lucide-react";
import { useTranslations } from "next-intl";
import { UpdateUserNameForm } from "@/features/auth/containers/update-user-name-form";
import { User } from "@/features/auth/types";
import {
  Divider,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";

type Props = {
  user: User;
};

export const ChangeName = ({ user }: Props) => {
  const t = useTranslations();
  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();

  return (
    <>
      <ListTile onPress={onOpen}>
        <Pen className="text-primary" />
        {t("changeName")}
      </ListTile>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>{t("changeName")}</ModalHeader>
          <Divider />
          <ModalFooter>
            <UpdateUserNameForm onSuccess={onClose} user={user} />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
