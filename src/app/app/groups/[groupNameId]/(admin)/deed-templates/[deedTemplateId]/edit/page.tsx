import { getDeedTemplateById } from "@/features/deed-template/api";
import { UpdateDeedTemplateView } from "../_components/update-deed-template-view";
import { extractError } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { ErrorState } from "@/components/error-state";

type Props = {
  params: Promise<{
    groupNameId: string;
    deedTemplateId: string;
  }>;
};

const UpdateDeedTemplatePage = async ({ params }: Props) => {
  const t = await getTranslations();
  const { groupNameId, deedTemplateId } = await params;
  const [name, id] = decodeURIComponent(groupNameId).split("_");

  const deedTemplate = await getDeedTemplateById(Number(deedTemplateId));
  const error = extractError(deedTemplate, t);

  if (error) return <ErrorState error={error} />;

  return (
    <UpdateDeedTemplateView
      deedTemplate={deedTemplate.data!.deedTemplate}
      deedStatuses={deedTemplate.data!.deedStatuses}
      groupId={Number(id)}
      groupName={name}
    />
  );
};

export default UpdateDeedTemplatePage;
