import { Header } from "@/components/layout/Heading";
import { Main } from "@/components/layout/Main";
import { Title } from "@/components/layout/Title";
import { MyDeedTemplatesView } from "@/deeds/components/MyDeedTemplatesView";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations("HomePage");

  return (
    <Main>
      <Header>
        <Title>{t("title")}</Title>
      </Header>
      <MyDeedTemplatesView />
    </Main>
  );
}
