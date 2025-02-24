"use client";

import { DuplicateDeedTemplateForm } from "@/features/deed-template/components/duplicate-deed-template-form";
import { routes } from "@/lib/routes";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  Divider,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { IconButton } from "@/components/icon-buttons";
import { Copy } from "lucide-react";
type Props = {
  deedTemplateId: number;
  groupName: string;
  groupId: number;
};

export const DuplicateDeedTemplate = ({
  deedTemplateId,
  groupName,
  groupId,
}: Props) => {
  const t = useTranslations();
  const router = useRouter();
  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton Icon={Copy} onPress={onOpen} />

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          <ModalHeader>{t("duplicate")}</ModalHeader>
          <Divider />
          <ModalFooter>
            <DuplicateDeedTemplateForm
              deedTemplateId={deedTemplateId}
              onSuccess={() => {
                onClose();
                router.push(
                  routes.groups.nameId(groupName, groupId).deedTemplates.root
                );
              }}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
