import { Main } from "@/components/layout/no";
import { Navbar } from "@/components/layout/navbar";
import { PageContainer } from "@/components/layout/page-container";
import { routes } from "@/lib/routes";
import { getTranslations } from "next-intl/server";
import { CreateDeedStatus } from "../_components/create-deed-status";

type Props = {
  children: React.ReactNode;
  params: Promise<{
    groupNameId: string;
    deedTemplateId: string;
  }>;
};

const UpdateDeedTemplateLayout = async ({ children, params }: Props) => {
  const t = await getTranslations();
  const { groupNameId, deedTemplateId } = await params;
  const [name, id] = decodeURIComponent(groupNameId).split("_");

  return (
    <PageContainer>
      <Navbar
        hrefBackButton={routes.groups.nameId(name, id).deedTemplates.root}
        trailing={<CreateDeedStatus deedTemplateId={Number(deedTemplateId)} />}
      >
        {t("updateDeedTemplate")}
      </Navbar>
      <Main>{children}</Main>
    </PageContainer>
  );
};

export default UpdateDeedTemplateLayout;
