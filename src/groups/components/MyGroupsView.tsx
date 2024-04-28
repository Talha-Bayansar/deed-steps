"use client";
import { generateArray, isArrayEmpty } from "@/lib/utils";
import { getMyGroups } from "../service";
import { GroupCard, GroupCardSkeleton } from "./GroupCard";
import { View } from "@/components/layout/View";
import { EmptyView } from "@/components/EmptyView";
import { Users } from "lucide-react";
import { routes } from "@/lib/routes";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

export const MyGroupsView = () => {
  const { data: myGroups, isLoading } = useQuery({
    queryKey: ["myGroups"],
    queryFn: async () => await getMyGroups(),
  });

  if (isLoading) {
    return <MyGroupsViewSkeleton />;
  }

  if (!myGroups || isArrayEmpty(myGroups))
    return (
      <EmptyView
        Icon={Users}
        message="You are not a member of any group yet."
        actionComponent={
          <Button asChild>
            <Link href={routes.groups.create.root}>Create group</Link>
          </Button>
        }
      />
    );

  return (
    <View>
      {myGroups.map((group) => (
        <Link key={group.id} href={routes.groups.id(group.id.toString())}>
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
