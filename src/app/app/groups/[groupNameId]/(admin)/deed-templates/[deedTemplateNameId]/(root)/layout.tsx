import { Main } from "@/components/layout/main";
import { Navbar } from "@/components/layout/navbar";
import { PageContainer } from "@/components/layout/page-container";
import { routes } from "@/lib/routes";
import { RevalidateButton } from "@/components/revalidate-button";
import { deedStatusesKey } from "@/features/deed-status/queries";
import Link from "next/link";
import { Edit } from "lucide-react";

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
          <div className="flex items-center gap-4">
            <RevalidateButton tags={[deedStatusesKey]} />{" "}
            <Link
              className="text-primary"
              href={
                routes.groups
                  .nameId(name, id)
                  .deedTemplates.nameId(templateName, templateId).update.root
              }
            >
              <Edit />
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
