import { Main } from "@/components/layout/main";
import { Navbar } from "@/components/layout/navbar";
import { PageContainer } from "@/components/layout/page-container";
import { RevalidateButton } from "@/components/revalidate-button";
import { userToGroupKey } from "@/features/user-to-group/queries";
import { groupsKey } from "@/features/group/queries";
import { routes } from "@/lib/routes";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { AddIconButton } from "@/components/icon-buttons/plus-icon-button";

type Props = {
  children: React.ReactNode;
};

const GroupsRootLayout = async ({ children }: Props) => {
  const t = await getTranslations();

  return (
    <PageContainer>
      <Navbar
        trailing={
          <div className="flex items-center gap-2">
            <RevalidateButton tags={[groupsKey, userToGroupKey]} />
            <Link href={routes.groups.create.root}>
              <AddIconButton />
            </Link>
          </div>
        }
      >
        {t("groups")}
      </Navbar>
      <Main>{children}</Main>
    </PageContainer>
  );
};

export default GroupsRootLayout;
