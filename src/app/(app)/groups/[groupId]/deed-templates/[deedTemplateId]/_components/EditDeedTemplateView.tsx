"use client";

import { EmptyView } from "@/components/EmptyView";
import { View } from "@/components/layout/View";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { DeedStatusTile } from "@/deeds/components/DeedStatusTile";
import { DeedTemplateForm } from "@/deeds/components/DeedTemplateForm";
import { useDeedTemplateById } from "@/deeds/hooks/useDeedTemplateById";
import { generateArray } from "@/lib/utils";
import { ListChecks } from "lucide-react";
import { useParams } from "next/navigation";
import { ChangeNameTile } from "./ChangeNameTile";

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
            <Drawer key={status.id}>
              <DrawerTrigger asChild>
                <DeedStatusTile status={status} />
              </DrawerTrigger>
              <DrawerContent>
                <div className="p-4">
                  <DeedTemplateForm
                    deedTemplate={data}
                    onSubmit={console.log}
                    isLoading={false}
                  />
                </div>
              </DrawerContent>
            </Drawer>
          ))}
        </View>
      </View>
    </View>
  );
};

const EditDeedTemplateViewSkeleton = () => {
  return (
    <View>
      {generateArray().map((i) => (
        <Skeleton key={i} className="w-full h-20" />
      ))}
    </View>
  );
};
