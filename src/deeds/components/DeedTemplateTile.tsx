"use client";

import { ListTile } from "@/components/ListTile";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import type { DeedStatus, DeedTemplate } from "../models";
import { useState } from "react";
import { View } from "@/components/layout/View";
import { useGroupById } from "@/groups/hooks/useGroupById";
import { Button } from "@/components/ui/button";
import { isLastOfArray } from "@/lib/utils";
import { DeedStatusTile } from "./DeedStatusTile";
import Link from "next/link";
import { routes } from "@/lib/routes";

type Props = {
  deedTemplate: DeedTemplate & {
    statuses: DeedStatus[];
  };
};

export const DeedTemplateTile = ({ deedTemplate }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useGroupById(deedTemplate.groupId.toString());

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <ListTile onClick={() => setIsOpen(true)}>{deedTemplate.name}</ListTile>
      </DrawerTrigger>
      <DrawerContent>
        <View className="p-4">
          {data?.isOwner && (
            <Button asChild>
              <Link
                href={
                  routes.groups
                    .id(deedTemplate.groupId.toString())
                    .deedTemplates.id(deedTemplate.id.toString()).edit.root
                }
              >
                Manage
              </Link>
            </Button>
          )}
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
