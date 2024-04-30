"use client";
import { EmptyView } from "@/components/EmptyView";
import { IconButton } from "@/components/IconButton";
import { Title, TitleSkeleton } from "@/components/layout/Title";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GroupDeedTemplatesView } from "@/deeds/components/GroupDeedTemplatesView";
import { GroupMembersView } from "@/groups/components/GroupMembersView";
import { useGroupById } from "@/groups/hooks/useGroupById";
import { routes } from "@/lib/routes";
import { Users, Settings } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export const GroupDetailsView = () => {
  const { groupId } = useParams<{ groupId: string }>();
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
      <Tabs className="flex-grow" defaultValue="members">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="deeds">Deeds</TabsTrigger>
        </TabsList>
        <TabsContent className="h-full" value="members">
          <GroupMembersView groupId={groupId} />
        </TabsContent>
        <TabsContent className="h-full" value="deeds">
          <GroupDeedTemplatesView groupId={groupId} />
        </TabsContent>
      </Tabs>
    </>
  );
};

const GroupDetailsViewSkeleton = () => {
  return (
    <>
      <TitleSkeleton />
      <Skeleton className="w-full h-full" />
    </>
  );
};
