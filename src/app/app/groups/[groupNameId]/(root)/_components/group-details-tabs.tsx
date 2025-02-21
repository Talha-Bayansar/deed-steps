"use client";

import { routes } from "@/lib/routes";
import { Tab, Tabs } from "@heroui/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export const GroupDetailsTabs = () => {
  const t = useTranslations();
  const pathname = usePathname();
  const { groupNameId } = useParams<{ groupNameId: string }>();
  const [name, id] = decodeURIComponent(groupNameId).split("_");

  return (
    <Tabs
      className="mb-8 w-full [&>div]:w-full"
      aria-label="navigation"
      selectedKey={pathname}
    >
      <Tab
        as={Link}
        key={routes.groups.nameId(name, id).root}
        href={routes.groups.nameId(name, id).root}
        title={t("members")}
      />
      <Tab
        as={Link}
        key={routes.groups.nameId(name, id).deeds.root}
        href={routes.groups.nameId(name, id).deeds.root}
        title={t("deeds")}
      />
    </Tabs>
  );
};
