import { Main } from "@/components/layout/main";
import { Navbar } from "@/components/layout/navbar";
import { PageContainer } from "@/components/layout/page-container";
import { routes } from "@/lib/routes";
import { RevalidateButton } from "@/components/revalidate-button";
import { groupPointsKey } from "@/features/group-points/queries";
import { usersKey } from "@/features/auth/queries";
import { groupsKey } from "@/features/group/queries";
import { deedTemplatesKey } from "@/features/deed-template/queries";
import { deedStatusesKey } from "@/features/deed-status/queries";
import { SettingsButton } from "./_components/settings-button";
import { PointsButton } from "./_components/points-button";
import { groupAdminsKey } from "@/features/group-admin/queries";

type Props = {
  params: Promise<{
    groupNameId: string;
  }>;
  children: React.ReactNode;
};

const GroupDetailsLayout = async ({ params, children }: Props) => {
  const { groupNameId } = await params;
  const [name, id] = decodeURIComponent(groupNameId).split("_");

  return (
    <PageContainer>
      <Navbar
        hrefBackButton={routes.groups.root}
        trailing={
          <div className="flex items-center gap-4">
            <PointsButton groupId={Number(id)} />
            <RevalidateButton
              tags={[
                groupPointsKey,
                usersKey,
                groupsKey,
                deedTemplatesKey,
                deedStatusesKey,
                groupAdminsKey,
              ]}
            />
            <SettingsButton groupName={name} groupId={id} />
          </div>
        }
      >
        {name}
      </Navbar>
      <Main>{children}</Main>
    </PageContainer>
  );
};

export default GroupDetailsLayout;
