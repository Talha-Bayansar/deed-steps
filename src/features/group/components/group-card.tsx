"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Group } from "../types";
import { useTranslations } from "next-intl";
import { UserToGroup } from "@/features/user-to-group/types";

type Props = {
  group: Group;
  userToGroup: UserToGroup;
};

export const GroupCard = ({ group, userToGroup }: Props) => {
  const t = useTranslations();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{group.name}</CardTitle>
        <CardDescription>
          {t("role")}: {t(userToGroup.role)}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};
