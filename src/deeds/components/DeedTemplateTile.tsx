"use client";

import { ListTile } from "@/components/ListTile";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import type { DeedStatus, DeedTemplate } from "../models";
import { useState } from "react";
import { View } from "@/components/layout/View";
import { useGroupById } from "@/groups/hooks/useGroupById";
import { isLastOfArray } from "@/lib/utils";
import { DeedStatusTile } from "./DeedStatusTile";

type Props = {
  deedTemplate: DeedTemplate & {
    statuses: DeedStatus[];
  };
};

export const DeedTemplateTile = ({ deedTemplate }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <ListTile onClick={() => setIsOpen(true)}>{deedTemplate.name}</ListTile>
      </DrawerTrigger>
      <DrawerContent>
        <View className="p-8">
          <View className="gap-0">
            {deedTemplate.statuses.map((status, i) => (
              <DeedStatusTile
                key={status.id}
                status={status}
                isClickable={false}
                withSeparator={!isLastOfArray(i, deedTemplate.statuses)}
              />
            ))}
          </View>
        </View>
      </DrawerContent>
    </Drawer>
  );
};
