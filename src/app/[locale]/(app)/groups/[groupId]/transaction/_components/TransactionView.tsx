"use client";

import { EmptyView } from "@/components/EmptyView";
import { View } from "@/components/layout/View";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGroupById } from "@/groups/hooks/useGroupById";
import { ArrowRightLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";

export const TransactionView = () => {
  const t = useTranslations("global");
  const tTransactionPage = useTranslations("TransactionPage");
  const { groupId } = useParams<{ groupId: string }>();
  const searchParams = useSearchParams();
  const amount = searchParams.get("amount") as string;
  const { data, isLoading } = useGroupById(groupId);

  if (isLoading) return <TransactionViewSkeleton />;

  if (!data)
    return (
      <EmptyView Icon={ArrowRightLeft} message={tTransactionPage("no_group")} />
    );

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

      <Button className="w-full">{t("submit")}</Button>
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
