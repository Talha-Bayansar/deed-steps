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
    <button className="list-tile">
      <Link href={routes.groups.nameId(groupName, groupId).deedTemplates.root}>
        <ListTile>
          <List className="text-primary" />
          {t("manage-deeds")}
        </ListTile>
      </Link>
    </button>
  );
};
