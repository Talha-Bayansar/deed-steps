"use client";

import { ListTile } from "@/components/list-tile";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { TransactionLinkForm } from "@/features/transaction/components/transaction-link-form";
import { Link } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
  groupName: string;
  groupId: number;
};

export const TransactionTile = ({ groupName, groupId }: Props) => {
  const t = useTranslations();

  return (
    <Drawer>
      <DrawerTrigger className="list-tile">
        <ListTile>
          <Link className="text-primary" />
          {t("generateTransactionLink")}
        </ListTile>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{t("generateTransactionLink")}</DrawerTitle>
        </DrawerHeader>
        <DrawerFooter>
          <TransactionLinkForm groupName={groupName} groupId={groupId} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
