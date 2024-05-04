import { Main } from "@/components/layout/Main";
import { EditDeedTemplateView } from "../_components/EditDeedTemplateView";
import { Title } from "@/components/layout/Title";
import { CreateDeedStatus } from "../_components/CreateDeedStatus";
import { Header } from "@/components/layout/Heading";
import { getTranslations } from "next-intl/server";

const Page = async () => {
  const t = await getTranslations("EditDeedTemplatePage");
  return (
    <Main>
      <Header>
        <Title>{t("title")}</Title>
        <CreateDeedStatus />
      </Header>
      <EditDeedTemplateView />
    </Main>
  );
};

export default Page;
