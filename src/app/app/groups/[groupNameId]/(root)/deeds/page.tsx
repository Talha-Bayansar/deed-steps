import { extractError } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { ErrorState } from "@/components/error-state";

import { GroupDeedTemplatesView } from "@/features/deed-template/components/group-deed-templates-view";
import { getDeedTemplatesByGroupId } from "@/features/deed-template/api";

type Props = {
  params: Promise<{
    groupNameId: string;
  }>;
};

const GroupDeedsPage = async ({ params }: Props) => {
  const { groupNameId } = await params;
  const t = await getTranslations();
  const id = decodeURIComponent(groupNameId).split("_")[1];

  const deedTemplates = await getDeedTemplatesByGroupId(Number(id));

  const error = extractError(deedTemplates, t);

  if (error) return <ErrorState error={error} />;

  return (
    <GroupDeedTemplatesView
      deedTemplates={deedTemplates.data!.deedTemplates}
      deedStatuses={deedTemplates.data!.deedStatuses}
    />
  );
};

export default GroupDeedsPage;
