"use client";

import { View } from "@/components/layout/view";
import { ListTile } from "@/components/list-tile";
import { Badge } from "@/components/ui/badge";
import { DeedStatus } from "@/features/deed-status/types";
import { useTranslations } from "next-intl";

type Props = {
  status: DeedStatus;
};

export const DeedStatusTile = ({ status }: Props) => {
  const t = useTranslations();
  return (
    <ListTile className="list-tile">
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
