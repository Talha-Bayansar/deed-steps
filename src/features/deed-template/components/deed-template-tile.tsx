"use client";

import { ListTile } from "@/components/list-tile";
import { DeedTemplate } from "../types";
import { DeedStatus } from "@/features/deed-status/types";
import { View } from "@/components/layout/view";
import { DeedStatusTile } from "@/features/deed-status/components/deed-status-tile";
import {
  Divider,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";

type Props = {
  deedTemplate: DeedTemplate;
  deedStatuses: DeedStatus[];
};

export const DeedTemplateTile = ({ deedTemplate, deedStatuses }: Props) => {
  const { isOpen, onOpenChange, onOpen } = useDisclosure();

  return (
    <>
      <ListTile onPress={onOpen}>{deedTemplate.name}</ListTile>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>{deedTemplate.name}</ModalHeader>
          <Divider />
          <ModalFooter>
            <View className="gap-2">
              {deedStatuses.map((status) => (
                <DeedStatusTile key={status.id} status={status} hideChevron />
              ))}
            </View>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
