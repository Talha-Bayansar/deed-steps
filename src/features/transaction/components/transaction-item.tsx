"use client";

import { ListTile } from "@/components/list-tile";
import { Transaction } from "../types";
import { User } from "@/features/auth/types";
import { View } from "@/components/layout/view";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Coins } from "lucide-react";

type Props = {
  transaction: Transaction;
  user: User;
};

export const TransactionItem = ({ transaction, user }: Props) => {
  const t = useTranslations();

  const detailItems: { label: string; value: string }[] = [
    {
      label: t("name"),
      value: `${user.firstName} ${user.lastName}`,
    },
    {
      label: t("email"),
      value: user.email,
    },
    {
      label: t("points"),
      value: transaction.amount,
    },
    {
      label: t("date"),
      value: format(transaction.createdAt, "dd/MM/yyyy HH:mm"),
    },
  ];

  return (
    <Drawer>
      <DrawerTrigger className="w-full">
        <ListTile hideChevron>
          <div className="w-full flex gap-4 justify-between items-center">
            <View className="gap-0 w-auto items-start">
              <h2 className="font-medium">
                {user.firstName} {user.lastName}
              </h2>
              <div className="text-xs text-muted-foreground">
                {format(transaction.createdAt, "dd/MM/yyyy HH:mm")}
              </div>
            </View>
            <div className="bg-muted p-1 rounded flex gap-2 items-center">
              <Coins className="text-yellow-400" /> -{transaction.amount}
            </div>
          </div>
        </ListTile>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{t("transaction")}</DrawerTitle>
        </DrawerHeader>
        <DrawerFooter>
          <View className="gap-0">
            {detailItems.map((v) => (
              <View key={v.label} className="list-tile gap-0">
                <div className="text-xs text-muted-foreground">{v.label}</div>
                <div>{v.value}</div>
              </View>
            ))}
          </View>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
