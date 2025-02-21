"use client";

import { isArrayEmpty } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { View } from "@/components/layout/view";
import { DeedTemplate } from "@/features/deed-template/types";
import { DeedStatus } from "@/features/deed-status/types";
import { EmptyState } from "@/components/empty-state";
import { UpdateDeedStatusTileView } from "@/features/deed-status/components/update-deed-status-tile-view";
import { CreateDeedStatus } from "./create-deed-status";

type Props = {
  deedTemplate: DeedTemplate;
  deedStatuses: DeedStatus[];
};

export const UpdateDeedTemplateView = ({
  deedTemplate,
  deedStatuses,
}: Props) => {
  const t = useTranslations();

  return (
    <View className="gap-1">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t("deedStatuses")}</h2>
        <CreateDeedStatus deedTemplateId={deedTemplate.id} />
      </div>
      {isArrayEmpty(deedStatuses) ? (
        <div className="mt-12 mb-8">
          <EmptyState
            title={t("emptyWarning")}
            description={t("emptyWarningAction")}
          />
        </div>
      ) : (
        <UpdateDeedStatusTileView deedStatuses={deedStatuses} />
      )}
    </View>
  );
};
