"use client";

import { format, startOfToday } from "date-fns";
import { useState } from "react";
import { useMyDeedsByDate } from "../hooks/use-my-deeds-by-date";
import { DeedTile } from "./deed-tile";
import { useTranslations } from "next-intl";
import { EmptyState } from "@/components/empty-state";
import { View } from "@/components/layout/view";
import { DeedTemplate } from "@/features/deed-template/types";
import { isArrayEmpty } from "@/lib/utils";
import { ScrollableCalendar } from "@/components/scrollable-calendar";
import { Group } from "@/features/group/types";
import { DeedStatus } from "@/features/deed-status/types";

type Props = {
  groupedDeedTemplates: {
    group: Group;
    templates: (DeedTemplate & {
      statuses: DeedStatus[];
    })[];
  }[];
};

export const DeedsView = ({ groupedDeedTemplates }: Props) => {
  const t = useTranslations();
  const today = startOfToday();
  const [selectedDay, setSelectedDay] = useState<Date>(today);
  const { data, isLoading: isLoadingMyDeeds } = useMyDeedsByDate(
    format(selectedDay, "yyyy-MM-dd")
  );

  if (isArrayEmpty(groupedDeedTemplates))
    return (
      <EmptyState
        title={t("emptyWarning")}
        description={t("emptyWarningAction")}
      />
    );

  const deeds = data?.data;

  return (
    <View>
      <ScrollableCalendar
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
      />

      <View>
        {groupedDeedTemplates.map((deedTemplate) => (
          <View className="gap-0" key={deedTemplate.group.id}>
            <h2 className="font-medium">{deedTemplate.group.name}</h2>
            <View className="gap-0">
              {deedTemplate.templates.map((template) => (
                <DeedTile
                  key={template.id}
                  deedTemplate={template}
                  deed={deeds?.find(
                    (deed) => deed.deedTemplateId === template.id
                  )}
                  isLoading={isLoadingMyDeeds}
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
