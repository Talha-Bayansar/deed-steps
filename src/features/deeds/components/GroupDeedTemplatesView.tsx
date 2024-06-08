"use client";

import { View } from "@/components/layout/View";
import { useDeedTemplatesByGroupId } from "../hooks/useDeedTemplatesByGroupId";
import { generateArray, isArrayEmpty } from "@/lib/utils";
import { EmptyView } from "@/components/EmptyView";
import { ListChecks } from "lucide-react";
import { DeedTemplateTile } from "./DeedTemplateTile";
import { ListTileSkeleton } from "@/components/ListTile";
import { useTranslations } from "next-intl";

type Props = {
  groupId: string;
};

export const GroupDeedTemplatesView = ({ groupId }: Props) => {
  const tGroupDetailsPage = useTranslations("GroupDetailsPage");
  const { data, isLoading } = useDeedTemplatesByGroupId(groupId);

  if (isLoading) return <GroupDeedTemplatesViewSkeleton />;

  if (!data || isArrayEmpty(data))
    return (
      <div className="flex flex-col h-full">
        <EmptyView Icon={ListChecks} message={tGroupDetailsPage("no_deeds")} />
      </div>
    );

  return (
    <View className="gap-0">
      {data.map((deedTemplate) => (
        <DeedTemplateTile key={deedTemplate.id} deedTemplate={deedTemplate} />
      ))}
    </View>
  );
};

const GroupDeedTemplatesViewSkeleton = () => {
  return (
    <View className="gap-0">
      {generateArray().map((i) => (
        <ListTileSkeleton key={i} />
      ))}
    </View>
  );
};
