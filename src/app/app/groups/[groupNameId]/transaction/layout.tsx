import { Main } from "@/components/layout/main";
import { Navbar } from "@/components/layout/navbar";
import { PageContainer } from "@/components/layout/page-container";
import { getTranslations } from "next-intl/server";

type Props = {
  children: React.ReactNode;
};

const TransactionLayout = async ({ children }: Props) => {
  const t = await getTranslations();

  return (
    <PageContainer>
      <Navbar>{t("transaction")}</Navbar>
      <Main>{children}</Main>
    </PageContainer>
  );
};

export default TransactionLayout;
