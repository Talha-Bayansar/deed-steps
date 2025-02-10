import { Main } from "@/components/layout/main";
import { Navbar } from "@/components/layout/navbar";
import { PageContainer } from "@/components/layout/page-container";
import { routes } from "@/lib/routes";
import { RevalidateButton } from "@/components/revalidate-button";
import { deedStatusesKey } from "@/features/deed-status/queries";
import Link from "next/link";
import { EditIconButton } from "@/components/icon-buttons/edit-icon-button";

type Props = {
  children: React.ReactNode;
  params: Promise<{
    groupNameId: string;
    deedTemplateNameId: string;
  }>;
};

const DeedTemplateDetailsLayout = async ({ children, params }: Props) => {
  const { groupNameId, deedTemplateNameId } = await params;
  const [name, id] = decodeURIComponent(groupNameId).split("_");
  const [templateName, templateId] =
    decodeURIComponent(deedTemplateNameId).split("_");

  return (
    <PageContainer>
      <Navbar
        hrefBackButton={routes.groups.nameId(name, id).deedTemplates.root}
        trailing={
          <div className="flex items-center gap-2">
            <RevalidateButton tags={[deedStatusesKey]} />{" "}
            <Link
              href={
                routes.groups
                  .nameId(name, id)
                  .deedTemplates.nameId(templateName, templateId).update.root
              }
            >
              <EditIconButton />
            </Link>
          </div>
        }
      >
        {templateName}
      </Navbar>
      <Main>{children}</Main>
    </PageContainer>
  );
};

export default DeedTemplateDetailsLayout;
