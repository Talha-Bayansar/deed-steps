"use client";

import { isArrayEmpty } from "@/lib/utils";
import { ChangeNameTile } from "./change-name-tile";
import { UpdateDeedStatusTile } from "./update-deed-status-tile";
import { DeleteDeedTemplate } from "./delete-deed-template";
import { useTranslations } from "next-intl";
import { DuplicateDeedTemplate } from "./duplicate-deed-template";
import { View } from "@/components/layout/view";
import { DeedTemplate } from "@/features/deed-template/types";
import { DeedStatus } from "@/features/deed-status/types";
import { EmptyState } from "@/components/empty-state";

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

  if (isArrayEmpty(deedStatuses))
    return (
      <EmptyState
        title={t("emptyWarning")}
        description={t("emptyWarningAction")}
      />
    );

  return (
    <View>
      <View className="gap-0">
        <h2 className="text-xl font-semibold">{deedTemplate.name}</h2>
        <ChangeNameTile
          groupName={groupName}
          groupId={groupId}
          deedTemplate={deedTemplate}
        />
      </View>
      <View className="gap-0">
        <h2 className="text-xl font-semibold">{t("deedStatuses")}</h2>
        <View className="gap-0">
          {deedStatuses
            .sort((a, b) => Number(a.reward) - Number(b.reward))
            .map((status) => (
              <UpdateDeedStatusTile key={status.id} status={status} />
            ))}
        </View>
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
