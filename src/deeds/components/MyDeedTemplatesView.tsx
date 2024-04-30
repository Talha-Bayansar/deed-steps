"use client";

import { View } from "@/components/layout/View";
import { useMyDeedTemplates } from "../hooks/useMyDeedTemplates";
import { ListTile, ListTileSkeleton } from "@/components/ListTile";
import { generateArray, isArrayEmpty, isLastOfArray } from "@/lib/utils";
import { EmptyView } from "@/components/EmptyView";
import { ListChecks } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

export const MyDeedTemplatesView = () => {
  const { data, isLoading } = useMyDeedTemplates();

  if (isLoading) return <MyDeedTemplatesViewSkeleton />;

  if (!data || isArrayEmpty(data))
    return (
      <EmptyView Icon={ListChecks} message="You don't have any deeds yet." />
    );

  return (
    <View className="gap-0">
      {data.map((deedTemplate) => (
        <Drawer key={deedTemplate.id}>
          <DrawerTrigger asChild>
            <ListTile>{deedTemplate.name}</ListTile>
          </DrawerTrigger>
          <DrawerContent>
            <View className="p-4 gap-0">
              {deedTemplate.statuses.map((status, i) => (
                <ListTile
                  key={status.id}
                  withSeparator={!isLastOfArray(i, deedTemplate.statuses)}
                >
                  <div className="flex gap-2 items-center">
                    <Badge
                      className="h-4 w-4 p-0 border border-gray-100"
                      style={{
                        backgroundColor: status.color,
                      }}
                    />
                    <span>{status.name}</span>
                  </div>
                </ListTile>
              ))}
            </View>
          </DrawerContent>
        </Drawer>
      ))}
    </View>
  );
};

const MyDeedTemplatesViewSkeleton = () => {
  return (
    <View className="gap-0">
      {generateArray().map((i) => (
        <ListTileSkeleton key={i} />
      ))}
    </View>
  );
};
