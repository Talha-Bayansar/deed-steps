"use client";
import { EmptyView } from "@/components/EmptyView";
import { IconButton } from "@/components/IconButton";
import { Header } from "@/components/layout/Heading";
import { Title, TitleSkeleton } from "@/components/layout/Title";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GroupDeedTemplatesView } from "@/deeds/components/GroupDeedTemplatesView";
import { GroupMembersView } from "@/groups/components/GroupMembersView";
import { useGroupById } from "@/groups/hooks/useGroupById";
import { useGroupPointsByGroupId } from "@/groups/hooks/useGroupPointsByGroupId";
import { routes } from "@/lib/routes";
import { Users, Settings, Coins } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export const GroupDetailsView = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { data, isLoading } = useGroupById(groupId);
  const { data: points, isLoading: isLoadingPoints } = useGroupPointsByGroupId(
    Number(groupId)
  );

  if (isLoading) return <GroupDetailsViewSkeleton />;

  if (!data)
    return <EmptyView Icon={Users} message="This group could not be found." />;

  return (
    <>
      <Header>
        <Title>{data.name}</Title>
        <div className="flex items-center">
          <div className="flex items-center gap-2 bg-gray-50 rounded p-2">
            <Coins className="text-yellow-400" /> {points?.points ?? "?"}
          </div>
          {data.isOwner && (
            <Link href={routes.groups.id(groupId).settings.root}>
              <IconButton>
                <Settings className="text-primary" />
              </IconButton>
            </Link>
          )}
        </div>
      </Header>
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
      <Header>
        <TitleSkeleton />
      </Header>
      <Skeleton className="w-full h-full" />
    </>
  );
};
