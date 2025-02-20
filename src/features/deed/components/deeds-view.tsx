"use client";

import { format, startOfToday } from "date-fns";
import { useState } from "react";
import { DeedTile } from "./deed-tile";
import { useFormatter, useTranslations } from "next-intl";
import { EmptyState } from "@/components/empty-state";
import { View } from "@/components/layout/view";
import { DeedTemplate } from "@/features/deed-template/types";
import { isArrayEmpty, normalizeDate } from "@/lib/utils";
import { ScrollableCalendar } from "@/components/scrollable-calendar";
import { Group } from "@/features/group/types";
import { DeedStatus } from "@/features/deed-status/types";
import { RRule } from "rrule";
import { Card, CardBody, CardHeader, Divider } from "@heroui/react";

type Props = {
  groups: Group[];
  deedTemplates: DeedTemplate[];
  deedStatuses: DeedStatus[];
};

export const DeedsView = ({ groups, deedTemplates, deedStatuses }: Props) => {
  const t = useTranslations();
  const today = startOfToday();
  const [selectedDay, setSelectedDay] = useState<Date>(today);
  const formatter = useFormatter();

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
      // const rule = new RRule(RRule) RRule.fromString(rruleString);
      const rule = new RRule(RRule.parseString(rruleString));

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
    <View className="gap-8">
      <ScrollableCalendar
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
      />
      <View>
        <h2 className="text-xl font-semibold">
          {formatter.dateTime(normalizeDate(selectedDay), {
            day: "2-digit",
            month: "long",
            year: "numeric",
            timeZone: "UTC",
          })}
        </h2>
        {groups.map((group) => (
          <Card className="gap-0" key={group.id}>
            <CardHeader>
              <h2 className="text-lg font-medium">{group.name}</h2>
            </CardHeader>
            <Divider />
            <CardBody className="gap-2">
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
            </CardBody>
          </Card>
        ))}
      </View>
    </View>
  );
};
