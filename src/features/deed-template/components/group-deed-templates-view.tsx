"use client";

import { isArrayEmpty } from "@/lib/utils";
import { DeedTemplateTile } from "./deed-template-tile";
import { useTranslations } from "next-intl";
import { DeedTemplate } from "../types";
import { EmptyState } from "@/components/empty-state";
import { View } from "@/components/layout/view";
import { DeedStatus } from "@/features/deed-status/types";

type Props = {
  deedTemplates: DeedTemplate[];
  deedStatuses: DeedStatus[];
};

export const GroupDeedTemplatesView = ({
  deedTemplates,
  deedStatuses,
}: Props) => {
  const t = useTranslations();

  if (isArrayEmpty(deedTemplates))
    return (
      <EmptyState
        title={t("emptyWarning")}
        description={t("emptyWarningAction")}
      />
    );

  return (
    <View className="gap-0">
      {deedTemplates.map((deedTemplate) => (
        <DeedTemplateTile
          key={deedTemplate.id}
          deedTemplate={deedTemplate}
          deedStatuses={deedStatuses
            .filter((ds) => ds.deedTemplateId === deedTemplate.id)
            .sort((a, b) => Number(a.reward) - Number(b.reward))}
        />
      ))}
    </View>
  );
};
