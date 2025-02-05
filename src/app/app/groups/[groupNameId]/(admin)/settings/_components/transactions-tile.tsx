"use client";

import { ListTile } from "@/components/list-tile";
import { routes } from "@/lib/routes";
import { ArrowRightLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

type Props = {
  groupName: string;
  groupId: number;
};

export const TransactionsTile = ({ groupName, groupId }: Props) => {
  const t = useTranslations();

  return (
    <button className="list-tile">
      <Link href={routes.groups.nameId(groupName, groupId).transactions.root}>
        <ListTile>
          <ArrowRightLeft className="text-primary" />
          {t("transactions")}
        </ListTile>
      </Link>
    </button>
  );
};
