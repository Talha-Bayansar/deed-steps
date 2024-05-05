"use client";

import { EmptyView } from "@/components/EmptyView";
import { ListTile, ListTileSkeleton } from "@/components/ListTile";
import { Title, TitleSkeleton } from "@/components/layout/Title";
import { View } from "@/components/layout/View";
import { useDeedTemplatesByGroupId } from "@/deeds/hooks/useDeedTemplatesByGroupId";
import { useGroupById } from "@/groups/hooks/useGroupById";
import { routes } from "@/lib/routes";
import { generateArray, isArrayEmpty } from "@/lib/utils";
import { ListChecks, Users } from "lucide-react";
import { Link } from "@/navigation";
import { useParams } from "next/navigation";
import { CreateDeedTemplate } from "./CreateDeedTemplate";
import { Heading } from "@/components/layout/Heading";
import { useTranslations } from "next-intl";
import { BackButton } from "@/components/BackButton";

export const DeedTemplatesView = () => {
  const tDeedTemplatesPage = useTranslations("DeedTemplatesPage");
  const { groupId } = useParams<{ groupId: string }>();
  const { data: group, isLoading: isLoadingGroup } = useGroupById(groupId);
  const { data: deedTemplates, isLoading: isLoadingDeedTemplates } =
    useDeedTemplatesByGroupId(groupId);

  if (isLoadingDeedTemplates || isLoadingGroup)
    return <DeedTemplatesViewSkeleton />;

  if (!group)
    return <EmptyView Icon={Users} message={tDeedTemplatesPage("no_group")} />;

  return (
    <>
      <Heading>
        <div className="flex items-center">
          <BackButton href={routes.groups.id(groupId).settings.root} />
          <Title>
            {tDeedTemplatesPage("title")}:{" "}
            <span className="text-primary">{group.name}</span>
          </Title>
        </div>
        <CreateDeedTemplate />
      </Heading>
      {!deedTemplates || isArrayEmpty(deedTemplates) ? (
        <EmptyView
          Icon={ListChecks}
          message={tDeedTemplatesPage("no_deed_templates")}
        />
      ) : (
        <View className="gap-0">
          {deedTemplates.map((deedTemplate) => (
            <Link
              key={deedTemplate.id}
              href={
                routes.groups
                  .id(groupId)
                  .deedTemplates.id(deedTemplate.id.toString()).edit.root
              }
            >
              <ListTile>{deedTemplate.name}</ListTile>
            </Link>
          ))}
        </View>
      )}
    </>
  );
};

const DeedTemplatesViewSkeleton = () => {
  return (
    <>
      <Heading>
        <TitleSkeleton />
      </Heading>
      <View className="gap-0">
        {generateArray().map((i) => {
          return <ListTileSkeleton key={i} />;
        })}
      </View>
    </>
  );
};
