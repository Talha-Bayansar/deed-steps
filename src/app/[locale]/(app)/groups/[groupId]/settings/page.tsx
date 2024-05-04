import { Main } from "@/components/layout/Main";
import { Title } from "@/components/layout/Title";
import { ChangeName } from "./_components/ChangeName";
import { DeleteGroup } from "./_components/DeleteGroup";
import { InviteUser } from "./_components/InviteUser";
import { ManageDeeds } from "./_components/ManageDeeds";
import { Header } from "@/components/layout/Heading";
import { getTranslations } from "next-intl/server";

const Page = async () => {
  const t = await getTranslations("GroupSettingsPage");
  return (
    <Main>
      <Header>
        <Title>{t("title")}</Title>
      </Header>
      <ChangeName />
      <InviteUser />
      <ManageDeeds />
      <DeleteGroup />
    </Main>
  );
};

export default Page;
