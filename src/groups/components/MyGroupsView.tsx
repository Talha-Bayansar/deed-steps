import { isArrayEmpty } from "@/lib/utils";
import { getMyGroups } from "../service";
import { GroupCard } from "./GroupCard";
import { View } from "@/components/layout/View";
import { EmptyView } from "@/components/EmptyView";
import { Users } from "lucide-react";

export const MyGroupsView = async () => {
  const myGroups = await getMyGroups();

  if (isArrayEmpty(myGroups))
    return (
      <EmptyView
        Icon={Users}
        message="You are not a member of any group yet."
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
