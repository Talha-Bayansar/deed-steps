"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "@/features/auth/types";
import { DeedTemplate } from "@/features/deed-template/types";
import { GroupDeedTemplatesView } from "@/features/deed-template/components/group-deed-templates-view";
import { GroupMembersView } from "@/features/group/components/group-members-view";
import { Group, GroupPoints } from "@/features/group/types";
import { useTranslations } from "next-intl";
import { DeedStatus } from "@/features/deed-status/types";
import { GroupAdmin } from "@/features/group-admin/types";

type Props = {
  group: Group;
  members: User[];
  points: GroupPoints[];
  isOwner?: boolean;
  isAdmin?: boolean;
  deedTemplates: DeedTemplate[];
  deedStatuses: DeedStatus[];
  groupAdmins: GroupAdmin[];
};

export const GroupDetailsView = ({
  group,
  members,
  points,
  isOwner = false,
  isAdmin = false,
  deedTemplates,
  deedStatuses,
  groupAdmins,
}: Props) => {
  const t = useTranslations();

  return (
    <Tabs className="flex flex-col flex-grow w-full" defaultValue="members">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="members">{t("members")}</TabsTrigger>
        <TabsTrigger value="deeds">{t("deeds")}</TabsTrigger>
      </TabsList>
      <TabsContent
        className="flex flex-col flex-grow data-[state=inactive]:hidden"
        value="members"
      >
        <GroupMembersView
          group={group}
          members={members}
          points={points}
          isOwner={isOwner}
          isAdmin={isAdmin}
          groupAdmins={groupAdmins}
        />
      </TabsContent>
      <TabsContent
        className="flex flex-col flex-grow data-[state=inactive]:hidden"
        value="deeds"
      >
        <GroupDeedTemplatesView
          deedStatuses={deedStatuses}
          deedTemplates={deedTemplates}
        />
      </TabsContent>
    </Tabs>
  );
};
