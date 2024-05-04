"use client";

import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import type { Group } from "../models";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";

type Props = {
  group: Group;
  isOwner: boolean;
};

export const GroupCard = ({ group, isOwner }: Props) => {
  const t = useTranslations("global");
  return (
    <Card className="p-4">
      <div className="flex flex-col gap-2">
        <CardTitle>{group.name}</CardTitle>
        <CardDescription>
          {t("status")}: {isOwner ? t("owner") : t("member")}
        </CardDescription>
      </div>
    </Card>
  );
};

export const GroupCardSkeleton = () => {
  return (
    <Card className="p-4">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    </Card>
  );
};
