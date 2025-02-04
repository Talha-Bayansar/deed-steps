"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "@/features/auth/types";
import { DeedTemplate } from "@/features/deed-template/types";
import { GroupDeedTemplatesView } from "@/features/deed-template/components/group-deed-templates-view";
import { GroupMembersView } from "@/features/group/components/group-members-view";
import { Group, GroupPoints } from "@/features/group/types";
import { useTranslations } from "next-intl";
import { DeedStatus } from "@/features/deed-status/types";
import { UserToGroup } from "@/features/user-to-group/types";

type Props = {
  group: Group;
  points: GroupPoints[];
  deedTemplates: DeedTemplate[];
  deedStatuses: DeedStatus[];
  groupUsers: { user_to_group: UserToGroup; user: User }[];
  currentUserToGroup: UserToGroup;
};

export const GroupDetailsView = ({
  group,
  points,
  deedTemplates,
  deedStatuses,
  groupUsers,
  currentUserToGroup,
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
          points={points}
          groupUsers={groupUsers}
          currentUserToGroup={currentUserToGroup}
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
