"use client";

import { languages } from "@/i18n";
import { changeLocale } from "@/i18n/api";
import { Select, SelectItem } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useAction } from "next-safe-action/hooks";

type Props = {
  locale: string;
};

export const ChangeLocale = ({ locale }: Props) => {
  const t = useTranslations();
  const changeLocaleAction = useAction(changeLocale);

  const getFullLanguage = (locale: string) => {
    switch (locale) {
      case "en":
        return t("en");
      case "nl":
        return t("nl");
      case "fr":
        return t("fr");
      case "tr":
        return t("tr");
      default:
        return t("tr");
    }
  };

  return (
    <Select
      label={t("language")}
      selectedKeys={[locale]}
      onSelectionChange={(v) =>
        changeLocaleAction.execute({
          locale: v.currentKey ?? "tr",
        })
      }
    >
      {languages.map((language) => (
        <SelectItem key={language}>{getFullLanguage(language)}</SelectItem>
      ))}
    </Select>
  );
};
