"use client";

import { EmptyView } from "@/components/EmptyView";
import { View } from "@/components/layout/View";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGroupById } from "@/groups/hooks/useGroupById";
import { useGroupPointsByGroupId } from "@/groups/hooks/useGroupPointsByGroupId";
import { createTransaction } from "@/groups/service";
import { useMutation } from "@tanstack/react-query";
import { ArrowRightLeft, Check, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";

export const TransactionView = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const t = useTranslations("global");
  const tTransactionPage = useTranslations("TransactionPage");
  const { groupId } = useParams<{ groupId: string }>();
  const searchParams = useSearchParams();
  const amount = searchParams.get("amount") as string;
  const { data, isLoading } = useGroupById(groupId);
  const { refetch } = useGroupPointsByGroupId(Number(groupId));
  const mutation = useMutation({
    mutationFn: async () => {
      await createTransaction(Number(groupId), Number(amount));
    },
    onError: () => {
      setError(true);
    },
    onSuccess: async () => {
      setSuccess(true);
      await refetch();
    },
  });

  if (isLoading) return <TransactionViewSkeleton />;

  if (!data)
    return (
      <EmptyView Icon={ArrowRightLeft} message={tTransactionPage("no_group")} />
    );

  if (error) return <ErrorView />;
  if (success) return <SuccessView />;

  return (
    <View className="items-center justify-between flex-grow">
      <View className="items-center justify-center flex-grow">
        <ArrowRightLeft size={60} className="text-primary" />
        <h2 className="text-2xl text-primary font-medium">{data.name}</h2>
        <View className="gap-0 items-center">
          <div className="text-xl font-medium">{t("points")}</div>
          <div className="text-xl text-primary font-medium">{amount}</div>
        </View>
      </View>

      <Button className="w-full" onClick={() => mutation.mutate()}>
        {t("submit")}
      </Button>
    </View>
  );
};

const SuccessView = () => {
  const t = useTranslations("TransactionPage");

  return (
    <View className="items-center justify-center flex-grow">
      <Check size={60} className="text-green-600" />
      <h2 className="text-xl font-medium text-center">{t("success")}</h2>
    </View>
  );
};

const ErrorView = () => {
  const t = useTranslations("TransactionPage");

  return (
    <View className="items-center justify-center flex-grow">
      <X size={60} className="text-destructive" />
      <h2 className="text-xl font-medium text-center">{t("error")}</h2>
    </View>
  );
};

const TransactionViewSkeleton = () => {
  const t = useTranslations("global");

  return (
    <View className="items-center justify-between flex-grow">
      <View className="items-center justify-center flex-grow">
        <ArrowRightLeft size={60} className="text-primary" />
        <Skeleton className="w-full h-8" />
        <View className="gap-0 items-center">
          <div className="text-xl font-medium">{t("points")}</div>
          <Skeleton className="w-6 h-7" />
        </View>
      </View>

      <Skeleton className="w-full h-10 rounded-md" />
    </View>
  );
};
