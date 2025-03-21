import { Main } from "@/components/layout/main";
import { Navbar } from "@/components/layout/navbar";
import { PageContainer } from "@/components/layout/page-container";
import { routes } from "@/lib/routes";
import { SettingsButton } from "./_components/settings-button";
import { PointsButton } from "./_components/points-button";
import { GroupDetailsTabs } from "./_components/group-details-tabs";

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
          <div className="flex items-center">
            <PointsButton groupId={Number(id)} />
            <SettingsButton groupName={name} groupId={id} />
          </div>
        }
      >
        {name}
      </Navbar>
      <Main>
        <GroupDetailsTabs />
        {children}
      </Main>
    </PageContainer>
  );
};

export default GroupDetailsLayout;
