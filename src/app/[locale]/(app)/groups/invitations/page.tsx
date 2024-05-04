import { Header } from "@/components/layout/Heading";
import { Main } from "@/components/layout/Main";
import { Title } from "@/components/layout/Title";
import { MyGroupInvitationsView } from "@/groups/components/MyGroupInvitationsView";
import { getTranslations } from "next-intl/server";

const Page = async () => {
  const t = await getTranslations("InvitationsPage");
  return (
    <Main>
      <Header>
        <Title>{t("title")}</Title>
      </Header>
      <MyGroupInvitationsView />
    </Main>
  );
};

export default Page;
