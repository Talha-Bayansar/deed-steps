import { Main } from "@/components/layout/no";
import { Navbar } from "@/components/layout/navbar";
import { PageContainer } from "@/components/layout/page-container";
import { routes } from "@/lib/routes";
import { NavbarTrailing } from "./_components/navbar-trailing";

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
        trailing={<NavbarTrailing groupName={name} groupId={id} />}
      >
        {name}
      </Navbar>
      <Main>{children}</Main>
    </PageContainer>
  );
};

export default GroupDetailsLayout;
