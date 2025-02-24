"use client";

import { ListTile } from "@/components/list-tile";
import { TransactionLinkForm } from "@/features/transaction/components/transaction-link-form";
import { Link } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Divider,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";

type Props = {
  groupName: string;
  groupId: number;
};

export const TransactionTile = ({ groupName, groupId }: Props) => {
  const t = useTranslations();
  const { isOpen, onOpenChange, onOpen } = useDisclosure();

  return (
    <>
      <ListTile onPress={onOpen}>
        <Link className="text-primary" />
        {t("generateTransactionLink")}
      </ListTile>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          <ModalHeader>{t("generateTransactionLink")}</ModalHeader>
          <Divider />
          <ModalFooter>
            <TransactionLinkForm groupName={groupName} groupId={groupId} />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
