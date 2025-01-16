import { Main } from "@/components/layout/main";
import { Title } from "@/components/layout/Title";
import { ChangeName } from "./_components/ChangeName";
import { DeleteGroup } from "./_components/DeleteGroup";
import { InviteUser } from "./_components/InviteUser";
import { ManageDeeds } from "./_components/ManageDeeds";
import { Heading } from "@/components/layout/Heading";
import { getTranslations } from "next-intl/server";
import { BackButton } from "@/components/BackButton";
import { routes } from "@/lib/routes";
import { GenerateTransactionLink } from "./_components/GenerateTransactionLink";
import { NotificationPreferences } from "./_components/NotificationPreferences";

type Props = {
  params: Promise<{
    groupId: string;
  }>;
};

const Page = async (props: Props) => {
  const params = await props.params;

  const { groupId } = params;

  const t = await getTranslations("GroupSettingsPage");
  return (
    <Main>
      <Heading>
        <div className="flex items-center">
          <BackButton href={routes.groups.id(groupId).root} />

          <Title>{t("title")}</Title>
        </div>
      </Heading>
      <ChangeName />
      <InviteUser />
      <ManageDeeds />
      <NotificationPreferences />
      <GenerateTransactionLink />
      <DeleteGroup />
    </Main>
  );
};

export default Page;
