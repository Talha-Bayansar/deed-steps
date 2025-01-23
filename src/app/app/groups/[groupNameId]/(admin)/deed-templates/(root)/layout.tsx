import { Main } from "@/components/layout/main";
import { Navbar } from "@/components/layout/navbar";
import { PageContainer } from "@/components/layout/page-container";
import { RevalidateButton } from "@/components/revalidate-button";
import { deedTemplatesKey } from "@/features/deed-template/queries";
import { routes } from "@/lib/routes";
import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

type Props = {
  children: React.ReactNode;
  params: Promise<{
    groupNameId: string;
  }>;
};

const DeedTemplatesRootLayout = async ({ children, params }: Props) => {
  const t = await getTranslations();
  const { groupNameId } = await params;
  const [name, id] = decodeURIComponent(groupNameId).split("_");

  return (
    <PageContainer>
      <Navbar
        hrefBackButton={routes.groups.nameId(name, id).settings.root}
        trailing={
          <div className="flex items-center gap-4">
            <RevalidateButton tags={[deedTemplatesKey]} />
            <Link
              href={routes.groups.nameId(name, id).deedTemplates.create.root}
              className="text-primary"
            >
              <Plus />
            </Link>
          </div>
        }
      >
        {t("deedTemplates")}
      </Navbar>
      <Main>{children}</Main>
    </PageContainer>
  );
};

export default DeedTemplatesRootLayout;
