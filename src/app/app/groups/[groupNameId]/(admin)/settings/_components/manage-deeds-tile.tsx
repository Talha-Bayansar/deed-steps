"use client";

import { ListTile } from "@/components/list-tile";
import { routes } from "@/lib/routes";
import { List } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

type Props = {
  groupName: string;
  groupId: number;
};

export const ManageDeedsTile = ({ groupName, groupId }: Props) => {
  const t = useTranslations();

  return (
    <ListTile
      as={Link}
      href={routes.groups.nameId(groupName, groupId).deedTemplates.root}
    >
      <List className="text-primary" />
      {t("manage-deeds")}
    </ListTile>
  );
};
