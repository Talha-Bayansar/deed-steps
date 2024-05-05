import { Main } from "@/components/layout/Main";
import { EditDeedTemplateView } from "../_components/EditDeedTemplateView";
import { Title } from "@/components/layout/Title";
import { CreateDeedStatus } from "../_components/CreateDeedStatus";
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
  const t = await getTranslations("EditDeedTemplatePage");
  return (
    <Main>
      <Heading>
        <div className="flex items-center">
          <BackButton href={routes.groups.id(groupId).deedTemplates.root} />
          <Title>{t("title")}</Title>
        </div>
        <CreateDeedStatus />
      </Heading>
      <EditDeedTemplateView />
    </Main>
  );
};

export default Page;
