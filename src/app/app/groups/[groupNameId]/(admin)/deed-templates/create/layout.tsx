import { Main } from "@/components/layout/no";
import { Navbar } from "@/components/layout/navbar";
import { PageContainer } from "@/components/layout/page-container";
import { routes } from "@/lib/routes";
import { getTranslations } from "next-intl/server";

type Props = {
  children: React.ReactNode;
  params: Promise<{
    groupNameId: string;
  }>;
};

const CreateDeedTemplateLayout = async ({ children, params }: Props) => {
  const t = await getTranslations();
  const { groupNameId } = await params;
  const [name, id] = decodeURIComponent(groupNameId).split("_");

  return (
    <PageContainer>
      <Navbar
        hrefBackButton={routes.groups.nameId(name, id).deedTemplates.root}
      >
        {t("createDeedTemplate")}
      </Navbar>
      <Main>{children}</Main>
    </PageContainer>
  );
};

export default CreateDeedTemplateLayout;
