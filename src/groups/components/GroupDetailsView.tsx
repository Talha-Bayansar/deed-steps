"use client";

import { Title, TitleSkeleton } from "@/components/layout/Title";
import { EmptyView } from "@/components/EmptyView";
import { Settings, Users } from "lucide-react";
import Link from "next/link";
import { IconButton } from "@/components/IconButton";
import { routes } from "@/lib/routes";
import { View } from "@/components/layout/View";
import { GroupMember } from "./GroupMember";
import { useGroupById } from "../hooks/useGroupById";

type Props = {
  groupId: string;
};

export const GroupDetailsView = ({ groupId }: Props) => {
  const { data, isLoading } = useGroupById(groupId);

  if (isLoading) return <GroupDetailsViewSkeleton />;
  if (!data)
    return <EmptyView Icon={Users} message="This group could not be found." />;

  return (
    <>
      <div className="flex justify-between items-start">
        <Title>{data.name}</Title>
        {data.isOwner && (
          <Link href={routes.groups.id(groupId).settings.root}>
            <IconButton>
              <Settings className="text-primary" />
            </IconButton>
          </Link>
        )}
      </div>
      <View className="gap-2">
        <h2 className="text-xl font-semibold">Members</h2>
        <View className="gap-0">
          {data.members?.map((member) => (
            <GroupMember
              key={member.userId}
              member={member.member}
              groupId={member.groupId}
              isOwner={data.isOwner}
            />
          ))}
        </View>
      </View>
    </>
  );
};

const GroupDetailsViewSkeleton = () => {
  return (
    <>
      <TitleSkeleton />
    </>
  );
};
