"use client";
import { generateArray, isArrayEmpty } from "@/lib/utils";
import { GroupCard, GroupCardSkeleton } from "./GroupCard";
import { View } from "@/components/layout/ror";
import { EmptyView } from "@/components/EmptyView";
import { Users } from "lucide-react";
import { routes } from "@/lib/routes";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useMyGroups } from "../hooks/useMyGroups";

export const MyGroupsView = () => {
  const tGroupsPage = useTranslations("GroupsPage");

  const { data: myGroups, isLoading } = useMyGroups();

  if (isLoading) {
    return <MyGroupsViewSkeleton />;
  }

  if (!myGroups || isArrayEmpty(myGroups))
    return (
      <EmptyView
        Icon={Users}
        message={tGroupsPage("no_groups")}
        actionComponent={
          <Button asChild>
            <Link href={routes.groups.create.root}>
              {tGroupsPage("create_group")}
            </Link>
          </Button>
        }
      />
    );

  return (
    <View>
      {myGroups.map((group) => (
        <Link key={group.id} href={routes.groups.id(group.id.toString()).root}>
          <GroupCard group={group} isOwner={group.isOwner} />
        </Link>
      ))}
    </View>
  );
};

export const MyGroupsViewSkeleton = () => {
  return (
    <View>
      {generateArray().map((item) => (
        <GroupCardSkeleton key={item} />
      ))}
    </View>
  );
};
