import { Main } from "@/components/layout/main";
import { Navbar } from "@/components/layout/navbar";
import { PageContainer } from "@/components/layout/page-container";
import { RevalidateButton } from "@/components/revalidate-button";
import { deedStatusesKey } from "@/features/deed-status/queries";
import { deedTemplatesKey } from "@/features/deed-template/queries";
import { groupsKey } from "@/features/group/queries";
import { getTranslations } from "next-intl/server";

type Props = {
  children: React.ReactNode;
};

const AppRootLayout = async ({ children }: Props) => {
  const t = await getTranslations();

  return (
    <PageContainer>
      <Navbar
        trailing={
          <RevalidateButton
            tags={[groupsKey, deedTemplatesKey, deedStatusesKey]}
          />
        }
      >
        {t("deeds")}
      </Navbar>
      <Main>{children}</Main>
    </PageContainer>
  );
};

export default AppRootLayout;
