import { Main } from "@/components/layout/main";
import { Navbar } from "@/components/layout/navbar";
import { PageContainer } from "@/components/layout/page-container";
import { routes } from "@/lib/routes";
import { getTranslations } from "next-intl/server";

type Props = {
  children: React.ReactNode;
};

const MySubscriptionLayout = async ({ children }: Props) => {
  const t = await getTranslations();

  return (
    <PageContainer>
      <Navbar hrefBackButton={routes.settings.root}>
        {t("mySubscription")}
      </Navbar>
      <Main>{children}</Main>
    </PageContainer>
  );
};

export default MySubscriptionLayout;
