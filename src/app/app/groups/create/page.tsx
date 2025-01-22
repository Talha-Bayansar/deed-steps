import { Main } from "@/components/layout/no";
import { Navbar } from "@/components/layout/navbar";
import { PageContainer } from "@/components/layout/page-container";
import { CreateGroupForm } from "@/features/group/components/create-group-form";
import { routes } from "@/lib/routes";
import { getTranslations } from "next-intl/server";

const CreateGroupPage = async () => {
  const t = await getTranslations();
  return (
    <PageContainer>
      <Navbar hrefBackButton={routes.groups.root}>{t("createGroup")}</Navbar>
      <Main>
        <CreateGroupForm />
      </Main>
    </PageContainer>
  );
};

export default CreateGroupPage;
