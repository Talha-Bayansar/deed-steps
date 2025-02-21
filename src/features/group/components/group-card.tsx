"use client";

import type { Group } from "../types";
import { useTranslations } from "next-intl";
import { UserToGroup } from "@/features/user-to-group/types";
import { Card, CardFooter, CardHeader, Divider, Button } from "@heroui/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { routes } from "@/lib/routes";

type Props = {
  group: Group;
  userToGroup: UserToGroup;
};

export const GroupCard = ({ group, userToGroup }: Props) => {
  const t = useTranslations();

  return (
    <Card>
      <CardHeader className="flex flex-col items-start gap-2">
        <h2 className="text-lg font-medium">{group.name}</h2>
        <div className="text-sm text-zinc-400">
          {t("role")}: {t(userToGroup.role)}
        </div>
      </CardHeader>
      <Divider />
      <CardFooter>
        <Button
          as={Link}
          href={routes.groups.nameId(group.name, group.id).root}
        >
          {t("view")} <ArrowRight className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
