"use client";

import { ListTile } from "@/components/list-tile";
import { Transaction } from "../types";
import { User } from "@/features/auth/types";
import { View } from "@/components/layout/view";
import { useTranslations } from "next-intl";
import { format } from "date-fns";

type Props = {
  transaction: Transaction;
  user: User;
};

export const TransactionItem = ({ transaction, user }: Props) => {
  const t = useTranslations();

  return (
    <ListTile hideChevron>
      <View className="gap-1.5">
        <View className="gap-0">
          <h2 className="font-medium">
            {user.firstName} {user.lastName}
          </h2>
          <div className="text-xs text-muted-foreground">{user.email}</div>
        </View>

        <div className="text-xs">
          {t("points")}: <b>{transaction.amount}</b>
        </div>
        <div className="text-xs">
          {format(transaction.createdAt, "dd/MM/yyyy HH:mm")}
        </div>
      </View>
    </ListTile>
  );
};
