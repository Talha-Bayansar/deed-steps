"use client";

import { View } from "@/components/layout/View";
import { useMyDeedTemplates } from "../hooks/useMyDeedTemplates";
import { ListTileSkeleton } from "@/components/ListTile";
import { generateArray, isArrayEmpty } from "@/lib/utils";
import { EmptyView } from "@/components/EmptyView";
import { ListChecks } from "lucide-react";
import { ScrollableCalendar } from "@/components/ScrollableCalendar";
import { startOfToday } from "date-fns";
import { useMemo, useState } from "react";
import { useMyDeedsByDate } from "../hooks/useMyDeedsByDate";
import { DeedTile } from "./DeedTile";
import { useTranslations } from "next-intl";

export const MyDeedTemplatesView = () => {
  const tHomePage = useTranslations("HomePage");
  const today = startOfToday();
  const [selectedDay, setSelectedDay] = useState<Date>(today);
  const { data, isLoading } = useMyDeedTemplates();
  const { data: myDeeds, isLoading: isLoadingMyDeeds } =
    useMyDeedsByDate(selectedDay);

  const groupedDeedTemplates = useMemo(
    () =>
      data?.reduce<(typeof data)[]>((previous, current) => {
        let result = previous;

        const groupExists = previous.find((group) =>
          group.find((deedTemplate) => deedTemplate.groupId === current.groupId)
        );

        if (groupExists) {
          result = previous.map((group) => {
            const templateWithSameGroup = group.find(
              (deedTemplate) => deedTemplate.groupId === current.groupId
            );
            if (templateWithSameGroup) {
              return [...group, current];
            } else {
              return group;
            }
          });
        } else {
          result = [...previous, [current]];
        }

        return result;
      }, []),
    [data]
  );

  if (isLoading) return <MyDeedTemplatesViewSkeleton />;

  if (!groupedDeedTemplates || isArrayEmpty(groupedDeedTemplates))
    return <EmptyView Icon={ListChecks} message={tHomePage("no_deeds")} />;

  return (
    <View>
      <ScrollableCalendar
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
      />

      <View>
        {groupedDeedTemplates.map((deedTemplates) => (
          <View className="gap-0" key={deedTemplates[0].groupId}>
            <h2 className="font-medium">{deedTemplates[0].group.name}</h2>
            <View className="gap-0">
              {deedTemplates.map((deedTemplate) => (
                <DeedTile
                  key={deedTemplate.id}
                  deedTemplate={deedTemplate}
                  deed={myDeeds?.find(
                    (deed) => deed.deedTemplateId === deedTemplate.id
                  )}
                  isLoading={isLoadingMyDeeds}
                  selectedDay={selectedDay}
                />
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const MyDeedTemplatesViewSkeleton = () => {
  return (
    <View className="gap-0">
      {generateArray().map((i) => (
        <ListTileSkeleton key={i} />
      ))}
    </View>
  );
};
