import { getDeedTemplatesByGroupId } from "@/features/deed-template/api";
import { DraggableDeedTemplates } from "../_components/draggable-deed-templates";
import { extractError, isArrayEmpty } from "@/lib/utils";
import { ErrorState } from "@/components/error-state";
import { getTranslations } from "next-intl/server";
import { EmptyState } from "@/components/empty-state";

type Props = {
  params: Promise<{
    groupNameId: string;
  }>;
};

const DeedTemplatesRootPage = async ({ params }: Props) => {
  const { groupNameId } = await params;
  const t = await getTranslations();
  const [name, id] = decodeURIComponent(groupNameId).split("_");

  const deedTemplates = await getDeedTemplatesByGroupId(Number(id));
  const error = extractError(deedTemplates, t);

  if (error) return <ErrorState error={error} />;

  if (isArrayEmpty(deedTemplates.data!))
    return (
      <EmptyState
        title={t("emptyWarning")}
        description={t("emptyWarningAction")}
      />
    );

  return (
    <DraggableDeedTemplates
      deedTemplates={deedTemplates.data!.sort((a, b) => a.order - b.order)}
      groupId={Number(id)}
      groupName={name}
    />
  );
};

export default DeedTemplatesRootPage;
