import { Main } from "@/components/layout/main";
import { Navbar } from "@/components/layout/navbar";
import { PageContainer } from "@/components/layout/page-container";
import { routes } from "@/lib/routes";
import { getTranslations } from "next-intl/server";

type Props = {
  children: React.ReactNode;
  params: Promise<{
    groupNameId: string;
    deedTemplateNameId: string;
  }>;
};

const UpdateDeedTemplateLayout = async ({ children, params }: Props) => {
  const t = await getTranslations();
  const { groupNameId, deedTemplateNameId } = await params;
  const [name, id] = decodeURIComponent(groupNameId).split("_");
  const [templateName, templateId] =
    decodeURIComponent(deedTemplateNameId).split("_");

  return (
    <PageContainer>
      <Navbar
        hrefBackButton={
          routes.groups
            .nameId(name, id)
            .deedTemplates.nameId(templateName, templateId).root
        }
      >
        {t("updateDeedTemplate")}
      </Navbar>
      <Main>{children}</Main>
    </PageContainer>
  );
};

export default UpdateDeedTemplateLayout;
