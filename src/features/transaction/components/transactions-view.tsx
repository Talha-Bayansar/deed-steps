"use client";

import { Transaction } from "../types";
import { TransactionItem } from "./transaction-item";
import { User } from "@/features/auth/types";
import { CustomResponse, isArrayEmpty } from "@/lib/utils";
import { EmptyState } from "@/components/empty-state";
import { useTranslations } from "next-intl";
import { InfiniteView } from "@/lib/pagination/components/infinite-view";
import { Pagination } from "@/lib/pagination/types";
import { getTransactionsByGroupId } from "../api";

type Props = {
  initialData: { transaction: Transaction; user: User }[];
  groupId: number;
};

export const TransactionsView = ({ initialData, groupId }: Props) => {
  const t = useTranslations();

  const fetchMore = async (pagination: Pagination) => {
    const response = await getTransactionsByGroupId(groupId, pagination);

    return response as CustomResponse<
      { transaction: Transaction; user: User }[]
    >;
  };

  if (isArrayEmpty(initialData))
    return (
      <EmptyState
        title={t("emptyWarning")}
        description={t("emptyWarningAction")}
      />
    );

  return (
    <InfiniteView
      className="gap-2"
      pageSize={30}
      initialItems={initialData}
      renderItem={(transaction) => (
        <TransactionItem
          key={transaction.transaction.id}
          transaction={transaction.transaction}
          user={transaction.user}
        />
      )}
      fetchMore={fetchMore}
    />
  );
};
