"use client";

import { ListTile } from "@/components/list-tile";
import { InviteUserForm } from "@/features/invitation/components/invite-user-form";
import { UserRoundPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import {
  Divider,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";

export const InviteUserTile = () => {
  const t = useTranslations();
  const { groupNameId } = useParams<{ groupNameId: string }>();
  const id = decodeURIComponent(groupNameId).split("_")[1];
  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();

  return (
    <>
      <ListTile onPress={onOpen}>
        <UserRoundPlus className="text-primary" />
        {t("inviteUser")}
      </ListTile>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          <ModalHeader>{t("inviteUser")}</ModalHeader>
          <Divider />
          <ModalFooter>
            <InviteUserForm groupId={Number(id)} onSuccess={onClose} />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
