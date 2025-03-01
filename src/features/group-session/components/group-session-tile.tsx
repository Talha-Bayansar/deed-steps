"use client";

import { ListTile } from "@/components/list-tile";
import { GroupSession } from "../types";
import { View } from "@/components/layout/view";
import { useFormatter, useTranslations } from "next-intl";
import { CircleStop, Play } from "lucide-react";
import { ButtonProps } from "@heroui/button";
import { cn } from "@/lib/utils";

type Props = {
  groupSession: GroupSession;
} & ButtonProps;

export const GroupSessionTile = ({
  groupSession,
  className,
  ...props
}: Props) => {
  const t = useTranslations();
  const formatter = useFormatter();

  return (
    <ListTile className={cn("p-3 h-auto text-left", className)} {...props}>
      <View className="gap-2">
        <span className="text-lg font-medium">
          {groupSession.name || t("groupSession")}
        </span>
        <View className="gap-1">
          <span className="flex items-center gap-1 text-xs text-zinc-400">
            <Play className="w-4 h-4 text-success" />
            {formatter.dateTime(new Date(groupSession.startedAt), {
              dateStyle: "medium",
            })}
          </span>
          {groupSession.endedAt && (
            <span className="flex items-center gap-1 text-xs text-zinc-400">
              <CircleStop className="w-4 h-4 text-danger" />
              {formatter.dateTime(new Date(groupSession.endedAt), {
                dateStyle: "medium",
              })}
            </span>
          )}
        </View>
        {groupSession.description && (
          <p className="text-sm text-zinc-400 mt-1">
            {groupSession.description}
          </p>
        )}
      </View>
    </ListTile>
  );
};
