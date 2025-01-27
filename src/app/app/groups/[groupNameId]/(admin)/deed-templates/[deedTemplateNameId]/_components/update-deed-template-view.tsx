"use client";

import { isArrayEmpty } from "@/lib/utils";
import { DeleteDeedTemplate } from "./delete-deed-template";
import { useTranslations } from "next-intl";
import { DuplicateDeedTemplate } from "./duplicate-deed-template";
import { View } from "@/components/layout/view";
import { DeedTemplate } from "@/features/deed-template/types";
import { DeedStatus } from "@/features/deed-status/types";
import { EmptyState } from "@/components/empty-state";
import { UpdateDeedStatusTileView } from "@/features/deed-status/components/update-deed-status-tile-view";
import { CreateDeedStatus } from "./create-deed-status";

type Props = {
  deedTemplate: DeedTemplate;
  deedStatuses: DeedStatus[];
  groupName: string;
  groupId: number;
};

export const UpdateDeedTemplateView = ({
  deedTemplate,
  deedStatuses,
  groupId,
  groupName,
}: Props) => {
  const t = useTranslations();

  return (
    <View>
      <View className="gap-0">
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
      <DuplicateDeedTemplate
        deedTemplateId={deedTemplate.id}
        groupId={groupId}
        groupName={groupName}
      />
      <DeleteDeedTemplate
        deedTemplateId={deedTemplate.id}
        groupId={groupId}
        groupName={groupName}
      />
    </View>
  );
};
