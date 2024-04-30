"use client";

import { EmptyView } from "@/components/EmptyView";
import { Users } from "lucide-react";
import { View } from "@/components/layout/View";
import { GroupMember } from "./GroupMember";
import { useGroupById } from "../../hooks/useGroupById";
import { generateArray } from "@/lib/utils";
import { ListTileSkeleton } from "@/components/ListTile";

type Props = {
  groupId: string;
};

export const GroupMembersView = ({ groupId }: Props) => {
  const { data, isLoading } = useGroupById(groupId);

  if (isLoading)
    return (
      <View className="gap-0">
        {generateArray().map((i) => (
          <ListTileSkeleton />
        ))}
      </View>
    );

  if (!data)
    return (
      <EmptyView
        Icon={Users}
        message="This group does not have any members yet."
      />
    );

  return (
    <View className="gap-0">
      {data.members?.map((member, i) => (
        <GroupMember
          key={member.userId}
          member={member.member}
          groupId={member.groupId}
          isOwner={data.isOwner}
        />
      ))}
    </View>
  );
};
