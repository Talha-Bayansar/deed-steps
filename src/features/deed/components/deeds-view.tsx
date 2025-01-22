"use client";

import { format, startOfToday } from "date-fns";
import { useState } from "react";
import { DeedTile } from "./deed-tile";
import { useTranslations } from "next-intl";
import { EmptyState } from "@/components/empty-state";
import { View } from "@/components/layout/a-new-view";
import { DeedTemplate } from "@/features/deed-template/types";
import { isArrayEmpty } from "@/lib/utils";
import { ScrollableCalendar } from "@/components/scrollable-calendar";
import { Group } from "@/features/group/types";
import { DeedStatus } from "@/features/deed-status/types";

type Props = {
  groups: Group[];
  deedTemplates: DeedTemplate[];
  deedStatuses: DeedStatus[];
};

export const DeedsView = ({ groups, deedTemplates, deedStatuses }: Props) => {
  const t = useTranslations();
  const today = startOfToday();
  const [selectedDay, setSelectedDay] = useState<Date>(today);

  if (isArrayEmpty(groups))
    return (
      <EmptyState
        title={t("emptyWarning")}
        description={t("emptyWarningAction")}
      />
    );

  return (
    <View>
      <ScrollableCalendar
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
      />

      <View>
        {groups.map((group) => (
          <View className="gap-0" key={group.id}>
            <h2 className="font-medium">{group.name}</h2>
            <View className="gap-0">
              {deedTemplates
                .filter((dt) => dt.groupId === group.id)
                .sort((a, b) => a.order - b.order)
                .map((template) => (
                  <DeedTile
                    key={`${group.id}_${template.id}`}
                    deedTemplate={template}
                    deedStatuses={deedStatuses
                      .filter((ds) => ds.deedTemplateId === template.id)
                      .sort((a, b) => Number(a.reward) - Number(b.reward))}
                    selectedDay={format(selectedDay, "yyyy-MM-dd")}
                  />
                ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};
