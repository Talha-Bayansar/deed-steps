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
import { CustomResponse, handleResponse } from "@/lib/utils";
import { useState } from "react";
import { endOfToday, startOfYesterday } from "date-fns";
import { DeedTemplate } from "@/features/deed-template/types";
import { DeedStatus } from "@/features/deed-status/types";
import { useAction } from "next-safe-action/hooks";
import { View } from "@/components/layout/view";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  useMyDeedsByDate,
  getMyDeedsByDateKey,
} from "../hooks/use-my-deeds-by-date";

type Props = {
  deedTemplate: DeedTemplate;
  deedStatuses: DeedStatus[];
  selectedDay: string;
};

export const DeedTile = ({
  deedTemplate,
  deedStatuses,
  selectedDay,
}: Props) => {
  const queryClient = useQueryClient();
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading } = useMyDeedsByDate(selectedDay);
  const deeds = data?.data;
  const deed = deeds?.find((d) => d.deedTemplateId === deedTemplate.id);
  const selectedDate = new Date(`${selectedDay}T00:00:00`);

  const { executeAsync } = useAction(saveDeed);

  const getStatus = () => {
    return deedStatuses.find((status) => status.id === deed?.deedStatusId);
  };

  const handleSaveDeed = async ({
    deedId,
    deedStatusId,
  }: {
    deedId?: number;
    deedStatusId: number;
  }) => {
    queryClient.setQueryData(
      getMyDeedsByDateKey(selectedDay),
      (response: CustomResponse<Deed[]>) => {
        const deeds = response.data;

        if (!deeds) return response;

        const deedToUpdate = deeds.find((d) => d.id === deedId);

        let newResponse = response;

        if (deedToUpdate) {
          const data = deeds.map((d) => {
            if (d.id === deedToUpdate.id) {
              return {
                ...d,
                deedStatusId: deedStatusId,
              };
            } else {
              return d;
            }
          });
          newResponse = {
            ...response,
            data,
          };
        } else {
          newResponse = {
            ...response,
            data: [
              ...deeds,
              {
                id: Date.now(),
                date: selectedDay,
                deedTemplateId: deedTemplate.id,
                deedStatusId,
                userId: Date.now(),
              },
            ],
          };
        }
        return newResponse;
      }
    );
    setIsOpen(false);

    const res = await executeAsync({
      deedStatusId: deedStatusId,
      deedTemplateId: deedTemplate.id,
      date: selectedDay,
    });

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
        className="list-tile"
        disabled={
          selectedDate > endOfToday() || startOfYesterday() > selectedDate
        }
      >
        <ListTile>
          <div className="flex gap-2 items-center">
            {isLoading ? (
              <Skeleton className="h-4 w-4 rounded-full" />
            ) : (
              <Badge
                className="h-4 w-4 p-0 border border-gray-100"
                style={{
                  backgroundColor: getStatus()
                    ? getStatus()?.color
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
            {deedStatuses.map((status) => (
              <button
                className="list-tile"
                key={status.id}
                onClick={() =>
                  handleSaveDeed({
                    deedId: deed?.id,
                    deedStatusId: status.id,
                  })
                }
              >
                <ListTile>
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
              </button>
            ))}
          </View>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
