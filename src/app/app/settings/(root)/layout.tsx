import { Main } from "@/components/layout/main";
import { Navbar } from "@/components/layout/navbar";
import { PageContainer } from "@/components/layout/page-container";
import { RevalidateButton } from "@/components/revalidate-button";
import { currentUserKey } from "@/features/auth/queries";
import { pushSubscriptionsKey } from "@/features/notification/queries";
import { getTranslations } from "next-intl/server";

type Props = {
  children: React.ReactNode;
};

const SettingsRootLayout = async ({ children }: Props) => {
  const t = await getTranslations();

  return (
    <PageContainer>
      <Navbar
        trailing={
          <RevalidateButton tags={[currentUserKey, pushSubscriptionsKey]} />
        }
      >
        {t("settings")}
      </Navbar>
      <Main>{children}</Main>
    </PageContainer>
  );
};

export default SettingsRootLayout;
