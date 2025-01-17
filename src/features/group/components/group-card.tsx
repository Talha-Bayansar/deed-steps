"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Group } from "../types";
import { useTranslations } from "next-intl";

type Props = {
  group: Group;
  isOwner: boolean;
};

export const GroupCard = ({ group, isOwner }: Props) => {
  const t = useTranslations();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{group.name}</CardTitle>
        <CardDescription>
          {t("role")}: {isOwner ? t("owner") : t("member")}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};
