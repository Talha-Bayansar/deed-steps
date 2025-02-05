"use client";

import { View } from "@/components/layout/view";
import { Transaction } from "../types";
import { TransactionItem } from "./transaction-item";
import { User } from "@/features/auth/types";
import { isArrayEmpty } from "@/lib/utils";
import { EmptyState } from "@/components/empty-state";
import { useTranslations } from "next-intl";

type Props = {
  transactions: { transaction: Transaction; user: User }[];
};

export const TransactionsView = ({ transactions }: Props) => {
  const t = useTranslations();

  if (isArrayEmpty(transactions))
    return (
      <EmptyState
        title={t("emptyWarning")}
        description={t("emptyWarningAction")}
      />
    );

  return (
    <View className="gap-0">
      {transactions
        .sort(
          (a, b) =>
            b.transaction.createdAt.getTime() -
            a.transaction.createdAt.getTime()
        )
        .map(({ transaction, user }) => (
          <div key={transaction.id} className="list-tile">
            <TransactionItem transaction={transaction} user={user} />
          </div>
        ))}
    </View>
  );
};
