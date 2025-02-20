"use client";

import { useTranslations } from "next-intl";
import { ListTile } from "@/components/list-tile";
import { Languages } from "lucide-react";
import { ChangeLocale } from "@/features/i18n/components/change-locale";
import {
  ModalHeader,
  ModalContent,
  Modal,
  useDisclosure,
  ModalFooter,
} from "@heroui/react";

type Props = {
  locale: string;
};

export const ChangeLocaleDrawer = ({ locale }: Props) => {
  const t = useTranslations();
  const { isOpen, onOpenChange, onOpen } = useDisclosure();

  return (
    <>
      <ListTile onPress={onOpen}>
        <Languages className="text-primary" />
        {t("changeLanguage")}
      </ListTile>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className="flex flex-col">
            <span>{t("changeLanguage")}</span>
            <span className="text-sm text-zinc-400 font-normal">
              {t("changeLocaleDescription")}
            </span>
          </ModalHeader>
          <ModalFooter>
            <ChangeLocale locale={locale} />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
