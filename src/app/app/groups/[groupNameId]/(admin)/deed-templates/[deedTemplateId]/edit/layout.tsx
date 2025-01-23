import { Main } from "@/components/layout/main";
import { Navbar } from "@/components/layout/navbar";
import { PageContainer } from "@/components/layout/page-container";
import { routes } from "@/lib/routes";
import { getTranslations } from "next-intl/server";
import { CreateDeedStatus } from "../_components/create-deed-status";
import { RevalidateButton } from "@/components/revalidate-button";
import { deedStatusesKey } from "@/features/deed-status/queries";

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
        trailing={
          <div className="flex items-center gap-4">
            <RevalidateButton tags={[deedStatusesKey]} />{" "}
            <CreateDeedStatus deedTemplateId={Number(deedTemplateId)} />
          </div>
        }
      >
        {t("updateDeedTemplate")}
      </Navbar>
      <Main>{children}</Main>
    </PageContainer>
  );
};

export default UpdateDeedTemplateLayout;
