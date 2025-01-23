import { Main } from "@/components/layout/main";
import { Navbar } from "@/components/layout/navbar";
import { PageContainer } from "@/components/layout/page-container";
import { RevalidateButton } from "@/components/revalidate-button";
import { invitationsKey } from "@/features/invitation/queries";
import { getTranslations } from "next-intl/server";

type Props = {
  children: React.ReactNode;
};

const InvitationsRootLayout = async ({ children }: Props) => {
  const t = await getTranslations();

  return (
    <PageContainer>
      <Navbar trailing={<RevalidateButton tags={[invitationsKey]} />}>
        {t("invitations")}
      </Navbar>
      <Main>{children}</Main>
    </PageContainer>
  );
};

export default InvitationsRootLayout;
