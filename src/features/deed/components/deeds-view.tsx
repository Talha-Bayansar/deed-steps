"use client";

import { format, startOfToday } from "date-fns";
import { useState } from "react";
import { DeedTile } from "./deed-tile";
import { useTranslations } from "next-intl";
import { EmptyState } from "@/components/empty-state";
import { View } from "@/components/layout/view";
import { DeedTemplate } from "@/features/deed-template/types";
import { isArrayEmpty, normalizeDate } from "@/lib/utils";
import { ScrollableCalendar } from "@/components/scrollable-calendar";
import { Group } from "@/features/group/types";
import { DeedStatus } from "@/features/deed-status/types";
import { RRule } from "rrule";

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

  const isDateMatchingRRule = (rruleString: string) => {
    try {
      const normalizedDate = normalizeDate(selectedDay); // Strip time
      const rule = RRule.fromString(rruleString);

      // Define a range to check occurrences (1 day before and after)
      const start = new Date(normalizedDate);
      start.setDate(normalizedDate.getDate() - 1); // Previous day
      const end = new Date(normalizedDate);
      end.setDate(normalizedDate.getDate() + 1); // Next day

      // Check occurrences within the range
      const occurrences = rule.between(start, end, false);

      return occurrences.some(
        (occurrence) =>
          format(normalizeDate(occurrence), "yyyy-MM-dd") ===
          format(normalizedDate, "yyyy-MM-dd")
      );
    } catch (error) {
      console.error("Invalid RRule string:", rruleString, error);
      return false;
    }
  };

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
                .filter(
                  (dt) =>
                    dt.groupId === group.id &&
                    isDateMatchingRRule(dt.recurrencyRule)
                )
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
