"use client";

import { ListTile } from "@/components/ListTile";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import type { DeedStatus, DeedTemplate } from "../models";
import { useState } from "react";
import { View } from "@/components/layout/View";
import { Badge } from "@/components/ui/badge";

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
        <View className="p-4">
          {deedTemplate.statuses.map((status) => (
            <div className="flex items-center gap-2" key={status.id}>
              <Badge
                className="h-4 w-4 p-0 border border-gray-100"
                style={{
                  backgroundColor: status.color,
                }}
              />
              <View className="gap-0">
                <span>{status.name}</span>
                <span className="text-gray-400 text-xs">
                  Reward: {status.reward}
                </span>
              </View>
            </div>
          ))}
        </View>
      </DrawerContent>
    </Drawer>
  );
};
