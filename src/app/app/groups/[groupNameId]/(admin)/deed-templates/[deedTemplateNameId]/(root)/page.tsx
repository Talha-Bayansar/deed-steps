import { getDeedTemplateById } from "@/features/deed-template/api";
import { UpdateDeedTemplateView } from "../_components/update-deed-template-view";
import { extractError } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { ErrorState } from "@/components/error-state";

type Props = {
  params: Promise<{
    deedTemplateNameId: string;
  }>;
};

const DeedTemplateDetailsPage = async ({ params }: Props) => {
  const t = await getTranslations();
  const { deedTemplateNameId } = await params;
  const templateId = decodeURIComponent(deedTemplateNameId).split("_")[1];

  const deedTemplate = await getDeedTemplateById(Number(templateId));
  const error = extractError(deedTemplate, t);

  if (error) return <ErrorState error={error} />;

  return (
    <UpdateDeedTemplateView
      deedTemplate={deedTemplate.data!.deedTemplate}
      deedStatuses={deedTemplate.data!.deedStatuses}
    />
  );
};

export default DeedTemplateDetailsPage;
