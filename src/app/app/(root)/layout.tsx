import { Main } from "@/components/layout/main";
import { Navbar } from "@/components/layout/navbar";
import { PageContainer } from "@/components/layout/page-container";
import { RevalidateButton } from "@/components/revalidate-button";
import { getUser } from "@/features/auth/api";
import { deedStatusesKey } from "@/features/deed-status/queries";
import { deedTemplatesKey } from "@/features/deed-template/queries";
import { groupsKey } from "@/features/group/queries";
import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";
import { getTranslations } from "next-intl/server";

type Props = {
  children: React.ReactNode;
};

const AppRootLayout = async ({ children }: Props) => {
  const user = await getUser();
  const t = await getTranslations();

  if (!user) redirect(routes.signIn.root);

  return (
    <PageContainer>
      <Navbar
        trailing={
          <RevalidateButton
            tags={[groupsKey, deedTemplatesKey, deedStatusesKey]}
          />
        }
      >
        <span className="font-normal">{t("hey")}, </span>
        <span className="font-bold">{user.firstName}</span>
      </Navbar>
      <Main>{children}</Main>
    </PageContainer>
  );
};

export default AppRootLayout;
