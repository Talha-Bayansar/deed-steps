"use client";

import { View } from "@/components/layout/View";
import { useMyDeedTemplates } from "../hooks/useMyDeedTemplates";
import { ListTileSkeleton } from "@/components/ListTile";
import { generateArray, isArrayEmpty } from "@/lib/utils";
import { EmptyView } from "@/components/EmptyView";
import { ListChecks } from "lucide-react";
import { ScrollableCalendar } from "@/components/ScrollableCalendar";
import { startOfToday } from "date-fns";
import { useState } from "react";
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

  if (isLoading) return <MyDeedTemplatesViewSkeleton />;

  if (!data || isArrayEmpty(data))
    return <EmptyView Icon={ListChecks} message={tHomePage("no_deeds")} />;

  return (
    <View>
      <ScrollableCalendar
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
      />

      <View className="gap-0">
        {data.map((deedTemplate) => (
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
