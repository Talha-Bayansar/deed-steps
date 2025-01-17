"use client";

import { Skeleton } from "@/components/ui/skeleton";
import type { Deed } from "../types";
import { saveDeed } from "../api";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ListTile } from "@/components/list-tile";
import { handleResponse } from "@/lib/utils";
import { useState } from "react";
import { endOfToday } from "date-fns";
import { DeedTemplate } from "@/features/deed-template/types";
import { DeedStatus } from "@/features/deed-status/types";
import { useAction } from "next-safe-action/hooks";
import { View } from "@/components/layout/view";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  deedTemplate: DeedTemplate & {
    statuses: DeedStatus[];
  };
  deed?: Deed;
  selectedDay: string;
  isLoading: boolean;
};

export const DeedTile = ({
  deedTemplate,
  deed,
  selectedDay,
  isLoading,
}: Props) => {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { executeAsync } = useAction(saveDeed);

  const getStatus = (
    deedTemplate: DeedTemplate & { statuses: DeedStatus[] }
  ) => {
    return deedTemplate.statuses.find(
      (status) => status.id === deed?.deedStatusId
    );
  };

  const handleSaveDeed = async ({
    deedId,
    deedStatusId,
  }: {
    deedId?: number;
    deedStatusId: number;
  }) => {
    const res = await executeAsync({
      deedStatusId: deedStatusId,
      deedTemplateId: deedTemplate.id,
      date: selectedDay,
    });

    queryClient.setQueryData(["myDeeds", selectedDay], (deeds: Deed[]) => {
      const deedToUpdate = deeds.find((d) => d.id === deedId);
      if (deedToUpdate) {
        return deeds.map((d) => {
          if (d.id === deedToUpdate.id) {
            return {
              ...d,
              deedStatusId: deedStatusId,
            };
          } else {
            return deed;
          }
        });
      } else {
        return [...deeds, { ...deed, id: Date.now() }];
      }
    });
    setIsOpen(false);

    handleResponse({
      t,
      response: res?.data,
      onError(message) {
        toast.error(message);
      },
    });
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger
        disabled={new Date(`${selectedDay}T00:00:00Z`) > endOfToday()}
        asChild
      >
        <ListTile>
          <div className="flex gap-2 items-center">
            {isLoading ? (
              <Skeleton className="h-4 w-4 rounded-full" />
            ) : (
              <Badge
                className="h-4 w-4 p-0 border border-gray-100"
                style={{
                  backgroundColor: getStatus(deedTemplate)
                    ? getStatus(deedTemplate)?.color
                    : "transparent",
                }}
              />
            )}

            <span>{deedTemplate.name}</span>
          </div>
        </ListTile>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{deedTemplate.name}</DrawerTitle>
        </DrawerHeader>
        <DrawerFooter>
          <View className="gap-0">
            {deedTemplate.statuses.map((status, i) => (
              <ListTile
                key={status.id}
                onClick={() =>
                  handleSaveDeed({
                    deedId: deed?.id,
                    deedStatusId: status.id,
                  })
                }
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
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
