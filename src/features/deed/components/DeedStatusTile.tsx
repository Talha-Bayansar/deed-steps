"use client";

import { ListTile } from "@/components/list-tile";
import type { DeedStatus } from "../types";
import { Badge } from "@/components/ui/badge";
import { View } from "@/components/layout/ror";
import { ButtonProps } from "@/components/ui/button";
import { useTranslations } from "next-intl";

type Props = {
  status: DeedStatus;
  withSeparator?: boolean;
  isClickable?: boolean;
} & ButtonProps;

export const DeedStatusTile = ({ status, ...rest }: Props) => {
  const t = useTranslations("global");
  return (
    <ListTile {...rest}>
      <div className="flex items-center gap-2">
        <Badge
          className="h-4 w-4 p-0 border border-gray-100"
          style={{
            backgroundColor: status.color,
          }}
        />
        <View className="gap-0 items-start">
          <span>{status.name}</span>
          <span className="text-gray-400 text-xs">
            {t("reward")}: {status.reward}
          </span>
        </View>
      </div>
    </ListTile>
  );
};
