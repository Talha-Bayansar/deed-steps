import { Main } from "@/components/layout/main";
import { Navbar } from "@/components/layout/navbar";
import { PageContainer } from "@/components/layout/page-container";
import { routes } from "@/lib/routes";
import { RevalidateButton } from "@/components/revalidate-button";
import { deedStatusesKey } from "@/features/deed-status/queries";
import Link from "next/link";
import { EditIconButton } from "@/components/icon-buttons/edit-icon-button";
import { DuplicateDeedTemplate } from "../_components/duplicate-deed-template";
import { DeleteDeedTemplate } from "../_components/delete-deed-template";

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
          <div className="flex items-center">
            <RevalidateButton tags={[deedStatusesKey]} />
            <DuplicateDeedTemplate
              deedTemplateId={Number(templateId)}
              groupId={Number(id)}
              groupName={name}
            />
            <EditIconButton
              as={Link}
              href={
                routes.groups
                  .nameId(name, id)
                  .deedTemplates.nameId(templateName, templateId).update.root
              }
            />
            <DeleteDeedTemplate
              deedTemplateId={Number(templateId)}
              groupId={Number(id)}
              groupName={name}
            />
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
