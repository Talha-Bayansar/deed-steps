import { BackButton } from "@/components/BackButton";
import { Heading } from "@/components/layout/Heading";
import { Main } from "@/components/layout/Main";
import { Title } from "@/components/layout/Title";
import { CreateGroupForm } from "@/groups/components/CreateGroupForm";
import { routes } from "@/lib/routes";
import { getTranslations } from "next-intl/server";

const Page = async () => {
  const t = await getTranslations("CreateGroupPage");
  return (
    <Main>
      <Heading>
        <div className="flex items-center">
          <BackButton href={routes.groups.root} />
          <Title>{t("title")}</Title>
        </div>
      </Heading>
      <CreateGroupForm />
    </Main>
  );
};

export default Page;
