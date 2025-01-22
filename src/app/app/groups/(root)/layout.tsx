import { Main } from "@/components/layout/main";
import { Navbar } from "@/components/layout/navbar";
import { PageContainer } from "@/components/layout/page-container";
import { InvitationsBadge } from "@/features/invitation/components/invitations-badge";
import { routes } from "@/lib/routes";
import { Inbox, Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

type Props = {
  children: React.ReactNode;
};

const GroupsRootLayout = async ({ children }: Props) => {
  const t = await getTranslations();

  return (
    <PageContainer>
      <Navbar
        trailing={
          <div className="flex items-center gap-4">
            <Link
              href={routes.groups.invitations.root}
              className="text-primary relative"
            >
              <Inbox />
              <InvitationsBadge />
            </Link>
            <Link href={routes.groups.create.root}>
              <Plus className="text-primary" />
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
