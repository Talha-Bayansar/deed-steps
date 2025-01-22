"use client";

import { createTransaction } from "@/features/group/api";
import { ArrowRightLeft, Check, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { handleResponse } from "@/lib/utils";
import { LoadingButton } from "@/components/loading-button";
import { View } from "@/components/layout/a-new-view";

type Props = {
  groupId: number;
  groupName: string;
  amount: number;
};

export const TransactionView = ({ amount, groupId, groupName }: Props) => {
  const t = useTranslations();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const { executeAsync, isPending } = useAction(createTransaction);

  const handleTransaction = async () => {
    const res = await executeAsync({
      amount,
      groupId,
    });

    handleResponse({
      t,
      response: res?.data,
      onError: () => {
        setError(true);
        setSuccess(false);
      },
      onSuccess: async () => {
        setSuccess(true);
        setError(false);
      },
    });
  };

  if (error) return <ErrorView />;
  if (success) return <SuccessView />;

  return (
    <View className="items-center justify-between flex-grow">
      <View className="items-center justify-center flex-grow">
        <ArrowRightLeft size={60} className="text-primary" />
        <h2 className="text-2xl text-primary font-medium">{groupName}</h2>
        <View className="gap-0 items-center">
          <div className="text-xl font-medium">{t("points")}</div>
          <div className="text-xl text-primary font-medium">{amount}</div>
        </View>
      </View>

      <LoadingButton
        className="w-full"
        onClick={handleTransaction}
        isLoading={isPending}
      >
        {t("submit")}
      </LoadingButton>
    </View>
  );
};

const SuccessView = () => {
  const t = useTranslations();

  return (
    <View className="items-center justify-center flex-grow">
      <Check size={60} className="text-green-600" />
      <h2 className="text-xl font-medium text-center">
        {t("transactionSuccess")}
      </h2>
    </View>
  );
};

const ErrorView = () => {
  const t = useTranslations();

  return (
    <View className="items-center justify-center flex-grow">
      <X size={60} className="text-destructive" />
      <h2 className="text-xl font-medium text-center">
        {t("transactionFailed")}
      </h2>
    </View>
  );
};
