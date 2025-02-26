import { Main } from "@/components/layout/main";
import { Navbar } from "@/components/layout/navbar";
import { PageContainer } from "@/components/layout/page-container";
import { RevalidateButton } from "@/components/revalidate-button";
import { deedStatusesKey } from "@/features/deed-status/queries";
import { deedTemplatesKey } from "@/features/deed-template/queries";
import { groupSessionsKey } from "@/features/group-session/queries";
import { groupsKey } from "@/features/group/queries";
import { transactionKey } from "@/features/transaction/queries";
import { userToGroupKey } from "@/features/user-to-group/queries";
import { routes } from "@/lib/routes";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{
    groupNameId: string;
  }>;
  children: React.ReactNode;
};

const GroupSettingsLayout = async ({ children, params }: Props) => {
  const t = await getTranslations();
  const { groupNameId } = await params;
  const [name, id] = decodeURIComponent(groupNameId).split("_");

  return (
    <PageContainer>
      <Navbar
        hrefBackButton={routes.groups.nameId(name, id).root}
        trailing={
          <RevalidateButton
            tags={[
              userToGroupKey,
              deedTemplatesKey,
              deedStatusesKey,
              transactionKey,
              groupsKey,
              groupSessionsKey,
            ]}
          />
        }
      >
        {t("settings")}
      </Navbar>
      <Main>{children}</Main>
    </PageContainer>
  );
};

export default GroupSettingsLayout;
