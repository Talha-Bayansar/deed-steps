import { Header } from "@/components/layout/Heading";
import { Main } from "@/components/layout/Main";
import { Title } from "@/components/layout/Title";
import { CreateGroupForm } from "@/groups/components/CreateGroupForm";
import { getTranslations } from "next-intl/server";

const Page = async () => {
  const t = await getTranslations("CreateGroupPage");
  return (
    <Main>
      <Header>
        <Title>{t("title")}</Title>
      </Header>
      <CreateGroupForm />
    </Main>
  );
};

export default Page;
