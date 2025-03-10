"use client";

import type { Deed } from "../types";
import { saveDeed } from "../api";
import { Badge } from "@/components/ui/badge";
import { ListTile } from "@/components/list-tile";
import { CustomResponse, handleResponse } from "@/lib/utils";
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
import {
  ButtonProps,
  Divider,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Skeleton,
  useDisclosure,
} from "@heroui/react";
import { DeedStatusTile } from "@/features/deed-status/components/deed-status-tile";

type Props = {
  deedTemplate: DeedTemplate;
  deedStatuses: DeedStatus[];
  selectedDay: string;
} & ButtonProps;

export const DeedTile = ({
  deedTemplate,
  deedStatuses,
  selectedDay,
  ...props
}: Props) => {
  const queryClient = useQueryClient();
  const t = useTranslations();
  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();
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
    onClose();

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
    <>
      <ListTile
        {...props}
        isDisabled={
          selectedDate > endOfToday() || startOfYesterday() > selectedDate
        }
        onPress={onOpen}
      >
        <div className="flex gap-2 items-center">
          <Skeleton className="h-4 w-4 rounded-full" isLoaded={!isLoading}>
            <Badge
              className="h-4 w-4 p-0 border border-white"
              style={{
                backgroundColor: getStatus()
                  ? getStatus()?.color
                  : "transparent",
              }}
            />
          </Skeleton>

          <span>{deedTemplate.name}</span>
        </div>
      </ListTile>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>{deedTemplate.name}</ModalHeader>
          <Divider />
          <ModalFooter>
            <View className="gap-2">
              {deedStatuses.map((status) => (
                <DeedStatusTile
                  key={status.id}
                  status={status}
                  onPress={() =>
                    handleSaveDeed({
                      deedId: deed?.id,
                      deedStatusId: status.id,
                    })
                  }
                  isDisabled={getStatus()?.id === status.id}
                  hideReward
                />
              ))}
            </View>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
