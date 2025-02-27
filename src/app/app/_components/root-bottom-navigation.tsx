"use client";

import { Home, Inbox, Settings, Users } from "lucide-react";
import { routes } from "@/lib/routes";
import { useTranslations } from "next-intl";
import { Tabs, Tab } from "@heroui/react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export const RootBottomNavigation = () => {
  const t = useTranslations();
  const pathname = usePathname();

  const tabs = [
    {
      label: t("home"),
      href: routes.app,
      Icon: Home,
    },
    {
      label: t("groups"),
      href: routes.groups.root,
      Icon: Users,
    },
    {
      label: t("invitations"),
      href: routes.invitations.root,
      Icon: Inbox,
    },
    {
      label: t("settings"),
      href: routes.settings.root,
      Icon: Settings,
    },
  ];

  const getSelectedKey = () => {
    if (pathname.includes(routes.groups.root)) {
      return routes.groups.root;
    } else if (pathname.includes(routes.invitations.root)) {
      return routes.invitations.root;
    } else if (pathname.includes(routes.settings.root)) {
      return routes.settings.root;
    } else if (routes.app === pathname) {
      return routes.app;
    }

    return undefined;
  };

  return (
    <Tabs
      className="fixed bottom-8 left-1/2 -translate-x-1/2 backdrop-blur-md bg-background/25 rounded-full"
      aria-label="navigation"
      selectedKey={getSelectedKey()}
      items={tabs}
      radius="full"
      color="primary"
      variant="bordered"
    >
      {(tab) => (
        <Tab
          className="p-5"
          as={Link}
          key={tab.href}
          href={tab.href}
          title={<tab.Icon />}
        />
      )}
    </Tabs>
  );
};
