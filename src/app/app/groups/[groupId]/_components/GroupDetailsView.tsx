"use client";
import { EmptyView } from "@/components/EmptyView";
import { IconButton } from "@/components/IconButton";
import { Heading } from "@/components/layout/Heading";
import { Title, TitleSkeleton } from "@/components/layout/Title";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GroupDeedTemplatesView } from "@/features/deeds/components/GroupDeedTemplatesView";
import { GroupMembersView } from "@/features/groups/components/GroupMembersView";
import { useGroupById } from "@/features/groups/hooks/useGroupById";
import { useGroupPointsByGroupId } from "@/features/groups/hooks/useGroupPointsByGroupId";
import { routes } from "@/lib/routes";
import { Users, Settings, Coins, Camera } from "lucide-react";
import { Link, useRouter } from "@/navigation";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { BackButton } from "@/components/BackButton";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";

export const GroupDetailsView = () => {
  const t = useTranslations("global");
  const router = useRouter();
  const tGroupDetailspage = useTranslations("GroupDetailsPage");
  const { groupId } = useParams<{ groupId: string }>();
  const { data, isLoading } = useGroupById(groupId);
  const { data: points } = useGroupPointsByGroupId(Number(groupId));

  const handleScan = (values: IDetectedBarcode[]) => {
    const value = values[0];
    router.push(value.rawValue);
  };

  if (isLoading) return <GroupDetailsViewSkeleton />;

  if (!data)
    return <EmptyView Icon={Users} message={tGroupDetailspage("no_group")} />;

  return (
    <>
      <Heading>
        <div className="flex items-center">
          <BackButton href={routes.groups.root} />
          <Title>{data.name}</Title>
        </div>
        <div className="flex items-center">
          <div className="flex items-center gap-2 bg-gray-50 rounded p-2">
            <Coins className="text-yellow-400" /> {points?.points ?? "?"}
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <IconButton>
                <Camera className="text-primary" />
              </IconButton>
            </DialogTrigger>
            <DialogContent>
              <Scanner onScan={handleScan} allowMultiple={false} />
            </DialogContent>
          </Dialog>
          {data.isOwner && (
            <Link href={routes.groups.id(groupId).settings.root}>
              <IconButton>
                <Settings className="text-primary" />
              </IconButton>
            </Link>
          )}
        </div>
      </Heading>
      <Tabs className="flex-grow" defaultValue="members">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="members">{t("members")}</TabsTrigger>
          <TabsTrigger value="deeds">{t("deeds")}</TabsTrigger>
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
      <Heading>
        <TitleSkeleton />
      </Heading>
      <Skeleton className="w-full h-full" />
    </>
  );
};
