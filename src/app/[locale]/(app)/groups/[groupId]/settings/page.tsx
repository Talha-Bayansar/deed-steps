import { Main } from "@/components/layout/Main";
import { Title } from "@/components/layout/Title";
import { ChangeName } from "./_components/ChangeName";
import { DeleteGroup } from "./_components/DeleteGroup";
import { InviteUser } from "./_components/InviteUser";
import { ManageDeeds } from "./_components/ManageDeeds";
import { Heading } from "@/components/layout/Heading";
import { getTranslations } from "next-intl/server";
import { BackButton } from "@/components/BackButton";
import { routes } from "@/lib/routes";

type Props = {
  params: {
    groupId: string;
  };
};

const Page = async ({ params: { groupId } }: Props) => {
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
      <DeleteGroup />
    </Main>
  );
};

export default Page;
