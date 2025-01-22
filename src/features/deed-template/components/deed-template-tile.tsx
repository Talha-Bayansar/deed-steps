"use client";

import { ListTile } from "@/components/list-tile";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useState } from "react";
import { DeedTemplate } from "../types";
import { DeedStatus } from "@/features/deed-status/types";
import { View } from "@/components/layout/view";
import { DeedStatusTile } from "@/features/deed-status/components/deed-status-tile";

type Props = {
  deedTemplate: DeedTemplate;
  deedStatuses: DeedStatus[];
};

export const DeedTemplateTile = ({ deedTemplate, deedStatuses }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger className="list-tile">
        <ListTile>{deedTemplate.name}</ListTile>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{deedTemplate.name}</DrawerTitle>
        </DrawerHeader>
        <DrawerFooter>
          <View className="gap-0">
            {deedStatuses.map((status) => (
              <DeedStatusTile
                key={status.id}
                className="list-tile"
                status={status}
                hideChevron
              />
            ))}
          </View>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
