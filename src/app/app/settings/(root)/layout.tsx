import { Main } from "@/components/layout/main";
import { Navbar } from "@/components/layout/navbar";
import { PageContainer } from "@/components/layout/page-container";
import { getTranslations } from "next-intl/server";

type Props = {
  children: React.ReactNode;
};

const SettingsRootLayout = async ({ children }: Props) => {
  const t = await getTranslations();

  return (
    <PageContainer>
      <Navbar>{t("settings")}</Navbar>
      <Main>{children}</Main>
    </PageContainer>
  );
};

export default SettingsRootLayout;
