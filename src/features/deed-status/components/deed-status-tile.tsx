"use client";

import { View } from "@/components/layout/view";
import { ListTile } from "@/components/list-tile";
import { Badge } from "@/components/ui/badge";
import { DeedStatus } from "@/features/deed-status/types";
import { ButtonProps } from "@heroui/button";
import { useTranslations } from "next-intl";

type Props = {
  status: DeedStatus;
  hideChevron?: boolean;
  hideReward?: boolean;
} & ButtonProps;

export const DeedStatusTile = ({
  status,
  hideReward = false,
  ...props
}: Props) => {
  const t = useTranslations();
  return (
    <ListTile className="p-2 h-auto" {...props}>
      <div className="flex items-center gap-2">
        <Badge
          className="h-4 w-4 p-0 border border-gray-100 shrink-0"
          style={{
            backgroundColor: status.color,
          }}
        />
        <View className="gap-0 items-start">
          <span>{status.name}</span>
          {!hideReward && (
            <span className="text-gray-400 text-xs">
              {t("reward")}: {status.reward}
            </span>
          )}
        </View>
      </div>
    </ListTile>
  );
};
