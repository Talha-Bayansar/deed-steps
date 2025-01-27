import { ErrorState } from "@/components/error-state";
import { getDeedTemplateById } from "@/features/deed-template/api";
import { UpdateDeedTemplateForm } from "@/features/deed-template/components/update-deed-template-form";
import { extractError } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{
    groupNameId: string;
    deedTemplateNameId: string;
  }>;
};

const UpdateDeedTemplatePage = async ({ params }: Props) => {
  const t = await getTranslations();
  const { groupNameId, deedTemplateNameId } = await params;
  const [name, id] = decodeURIComponent(groupNameId).split("_");
  const deedTemplateId = decodeURIComponent(deedTemplateNameId).split("_")[1];

  const deedTemplate = await getDeedTemplateById(Number(deedTemplateId));
  const error = extractError(deedTemplate, t);

  if (error) return <ErrorState error={error} />;

  return (
    <UpdateDeedTemplateForm
      groupId={Number(id)}
      groupName={name}
      deedTemplate={deedTemplate.data!.deedTemplate}
    />
  );
};

export default UpdateDeedTemplatePage;
