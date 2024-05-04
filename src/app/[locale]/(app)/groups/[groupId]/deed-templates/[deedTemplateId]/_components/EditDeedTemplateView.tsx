"use client";

import { EmptyView } from "@/components/EmptyView";
import { View } from "@/components/layout/View";
import { useDeedTemplateById } from "@/deeds/hooks/useDeedTemplateById";
import { generateArray } from "@/lib/utils";
import { ListChecks } from "lucide-react";
import { useParams } from "next/navigation";
import { ChangeNameTile } from "./ChangeNameTile";
import { ListTileSkeleton } from "@/components/ListTile";
import { UpdateDeedStatusTile } from "./UpdateDeedStatusTile";
import { DeleteDeedTemplate } from "./DeleteDeedTemplate";

export const EditDeedTemplateView = () => {
  const { deedTemplateId } = useParams<{
    deedTemplateId: string;
    groupId: string;
  }>();
  const { data, isLoading } = useDeedTemplateById(Number(deedTemplateId));

  if (isLoading) return <EditDeedTemplateViewSkeleton />;

  if (!data)
    return (
      <EmptyView
        Icon={ListChecks}
        message="This deed template could not be found."
      />
    );

  return (
    <View>
      <View className="gap-2">
        <h2 className="text-xl font-semibold">{data.name}</h2>
        <ChangeNameTile />
      </View>
      <View className="gap-2">
        <h2 className="text-xl font-semibold">Statuses</h2>
        <View className="gap-0">
          {data.statuses.map((status) => (
            <UpdateDeedStatusTile key={status.id} status={status} />
          ))}
        </View>
      </View>
      <DeleteDeedTemplate />
    </View>
  );
};

const EditDeedTemplateViewSkeleton = () => {
  return (
    <View className="gap-0">
      {generateArray().map((i) => (
        <ListTileSkeleton key={i} />
      ))}
    </View>
  );
};
