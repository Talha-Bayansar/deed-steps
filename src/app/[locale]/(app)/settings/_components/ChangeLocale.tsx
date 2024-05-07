"use client";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { routes } from "@/lib/routes";
import { useRouter } from "@/navigation";
import { locales } from "@/i18n";
import { ListTile } from "@/components/ListTile";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { View } from "@/components/layout/View";
import { useState } from "react";
import { Languages } from "lucide-react";

export const ChangeLocale = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { locale } = useParams<{ locale: string }>();
  const t = useTranslations("SettingsPage");
  const router = useRouter();
  const changeLocale = (locale: string) => {
    setIsOpen(false);
    router.replace(routes.settings.root, { locale });
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <ListTile>
          <Languages className="text-primary mr-2" size={16} />
          {t("change_language")}
        </ListTile>
      </DrawerTrigger>
      <DrawerContent>
        <View className="p-8 gap-2">
          <Select value={locale} onValueChange={changeLocale}>
            <SelectTrigger className="uppercase">
              <SelectValue placeholder={t("select_language")} />
            </SelectTrigger>
            <SelectContent>
              {locales.map((locale) => (
                <SelectItem className="uppercase" key={locale} value={locale}>
                  {locale}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DrawerDescription>{t("language_description")}</DrawerDescription>
        </View>
      </DrawerContent>
    </Drawer>
  );
};
