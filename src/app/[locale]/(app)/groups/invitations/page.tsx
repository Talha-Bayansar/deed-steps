import { BackButton } from "@/components/BackButton";
import { Heading } from "@/components/layout/Heading";
import { Main } from "@/components/layout/Main";
import { Title } from "@/components/layout/Title";
import { MyGroupInvitationsView } from "@/groups/components/MyGroupInvitationsView";
import { routes } from "@/lib/routes";
import { getTranslations } from "next-intl/server";

const Page = async () => {
  const t = await getTranslations("InvitationsPage");
  return (
    <Main>
      <Heading>
        <div className="flex items-center">
          <BackButton href={routes.groups.root} />
          <Title>{t("title")}</Title>
        </div>
      </Heading>
      <MyGroupInvitationsView />
    </Main>
  );
};

export default Page;
