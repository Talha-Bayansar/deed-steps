import { generateArray, isArrayEmpty } from "@/lib/utils";
import { getMyGroups } from "../service";
import { GroupCard, GroupCardSkeleton } from "./GroupCard";
import { View } from "@/components/layout/View";
import { EmptyView } from "@/components/EmptyView";
import { Users } from "lucide-react";
import { routes } from "@/lib/routes";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const MyGroupsView = async () => {
  const myGroups = await getMyGroups();

  if (isArrayEmpty(myGroups))
    return (
      <EmptyView
        Icon={Users}
        message="You are not a member of any group yet."
        actionComponent={
          <Button asChild>
            <Link href={routes.myGroups.create.root}>Create group</Link>
          </Button>
        }
      />
    );

  return (
    <View>
      {myGroups.map((item) => (
        <GroupCard
          key={item.group.id}
          group={item.group}
          userCount={item.userCount}
        />
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
