"use client";

import { EmptyView } from "@/components/EmptyView";
import { Users } from "lucide-react";
import { View } from "@/components/layout/ror";
import { GroupMember } from "./GroupMember";
import { useGroupById } from "../../hooks/useGroupById";
import { generateArray } from "@/lib/utils";
import { ListTileSkeleton } from "@/components/list-tile";
import { useTranslations } from "next-intl";

type Props = {
  groupId: string;
};

export const GroupMembersView = ({ groupId }: Props) => {
  const tGroupDetailspage = useTranslations("GroupDetailsPage");
  const { data, isLoading } = useGroupById(groupId);

  if (isLoading)
    return (
      <View className="gap-0">
        {generateArray().map((i) => (
          <ListTileSkeleton key={i} />
        ))}
      </View>
    );

  if (!data)
    return <EmptyView Icon={Users} message={tGroupDetailspage("no_members")} />;

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
