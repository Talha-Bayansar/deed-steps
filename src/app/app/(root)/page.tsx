import { ErrorState } from "@/components/error-state";
import { getMyDeedTemplates } from "@/features/deed-template/api";
import { DeedsView } from "@/features/deed/components/deeds-view";
import { extractError } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

export default async function AppRootPage() {
  const t = await getTranslations();

  const deedTemplates = await getMyDeedTemplates();

  const error = extractError(deedTemplates, t);
  if (error) return <ErrorState error={error} />;

  return <DeedsView groupedDeedTemplates={deedTemplates.data!} />;
}
