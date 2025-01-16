"use client";

import { Home, Settings, Users } from "lucide-react";
import { routes } from "@/lib/routes";
import {
  BottomNavigation,
  BottomNavigationTab,
} from "@/components/layout/bottom-navigation";
import { useTranslations } from "next-intl";

export const RootBottomNavigation = () => {
  const t = useTranslations();

  const tabs: BottomNavigationTab[] = [
    {
      label: t("home"),
      href: routes.root,
      Icon: Home,
    },
    {
      label: t("groups"),
      href: routes.groups.root,
      Icon: Users,
    },
    {
      label: t("settings"),
      href: routes.settings.root,
      Icon: Settings,
    },
  ];

  return <BottomNavigation tabs={tabs} />;
};
