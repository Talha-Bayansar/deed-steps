"use client";

import { Skeleton } from "@/components/ui/skeleton";
import type { DeedInsert, DeedStatus, DeedTemplate, Deed } from "../models";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveDeed } from "../actions/deeds";
import { useSession } from "@/features/auth/hooks/useSession";
import { Badge } from "@/components/ui/badge";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { View } from "@/components/layout/View";
import { ListTile } from "@/components/ListTile";
import { isLastOfArray } from "@/lib/utils";
import { useState } from "react";
import { endOfToday } from "date-fns";
import { useMyDeedsByDate } from "../hooks/useMyDeedsByDate";

type Props = {
  deedTemplate: DeedTemplate & {
    statuses: DeedStatus[];
  };
  deed?: Deed;
  selectedDay: Date;
  isLoading: boolean;
};

export const DeedTile = ({
  deedTemplate,
  deed,
  selectedDay,
  isLoading,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const { refetch: refetchDeeds } = useMyDeedsByDate(selectedDay);
  const queryClient = useQueryClient();

  const saveDeedMutation = useMutation({
    mutationFn: async (deedDto: DeedInsert) => await saveDeed(deedDto),
    onMutate(variables) {
      queryClient.setQueryData(["myDeeds", selectedDay], (deeds: Deed[]) => {
        const deedToUpdate = deeds.find((deed) => deed.id === variables.id);
        if (deedToUpdate) {
          return deeds.map((deed) => {
            if (deed.id === deedToUpdate.id) {
              return {
                ...deed,
                deedStatusId: variables.deedStatusId,
              };
            } else {
              return deed;
            }
          });
        } else {
          return [...deeds, { ...variables, id: Date.now() }];
        }
      });
      setIsOpen(false);
    },
    onSuccess: () => {
      refetchDeeds();
    },
  });

  const getStatus = (
    deedTemplate: DeedTemplate & { statuses: DeedStatus[] }
  ) => {
    return deedTemplate.statuses.find(
      (status) => status.id === deed?.deedStatusId
    );
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger disabled={selectedDay > endOfToday()} asChild>
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
        <View className="p-8 gap-0 overflow-y-scroll">
          {deedTemplate.statuses.map((status, i) => (
            <ListTile
              key={status.id}
              onClick={() =>
                saveDeedMutation.mutate({
                  id: deed?.id,
                  userId: session!.user!.id,
                  date: selectedDay,
                  deedStatusId: status.id,
                  deedTemplateId: deedTemplate.id,
                })
              }
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
  );
};
