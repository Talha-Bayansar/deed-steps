"use client";

import { useTranslations } from "next-intl";
import { ListTile } from "@/components/list-tile";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useState } from "react";
import { Languages } from "lucide-react";
import { ChangeLocale } from "@/features/i18n/components/change-locale";

type Props = {
  locale: string;
};

export const ChangeLocaleDrawer = ({ locale }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations();

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger className="w-full">
        <ListTile>
          <Languages className="text-primary" />
          {t("changeLanguage")}
        </ListTile>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{t("changeLanguage")}</DrawerTitle>
        </DrawerHeader>
        <DrawerFooter>
          <ChangeLocale locale={locale} />
          <DrawerDescription>{t("changeLocaleDescription")}</DrawerDescription>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
