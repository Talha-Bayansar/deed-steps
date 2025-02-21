"use client";

import { ListTile } from "@/components/list-tile";
import { UpdateGroupForm } from "@/features/group/components/update-group-form";
import { routes } from "@/lib/routes";
import { Pen } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import {
  Divider,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";

export const UpdateGroupTile = () => {
  const t = useTranslations();
  const { groupNameId } = useParams<{ groupNameId: string }>();
  const [name, id] = decodeURIComponent(groupNameId).split("_");
  const router = useRouter();
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
            <UpdateGroupForm
              onSuccess={(newValues) => {
                onClose();
                router.push(
                  routes.groups.nameId(newValues.name, id).settings.root
                );
              }}
              group={{
                id: Number(id),
                name,
              }}
            />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
