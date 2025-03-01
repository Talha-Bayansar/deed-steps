"use client";

import { ListTile } from "@/components/list-tile";
import { routes } from "@/lib/routes";
import { History } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

type Props = {
  groupName: string;
  groupId: number;
};

export const HistoryTile = ({ groupName, groupId }: Props) => {
  const t = useTranslations();

  return (
    <ListTile
      as={Link}
      href={routes.groups.nameId(groupName, groupId).history.root}
    >
      <History className="text-primary" />
      {t("history")}
    </ListTile>
  );
};
