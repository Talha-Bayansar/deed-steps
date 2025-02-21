"use client";

import { useGroupPointsByGroupId } from "@/features/group-points/hooks/use-group-points-by-group-id";
import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import { Coins, ScanQrCode } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalFooter,
  useDisclosure,
  ModalHeader,
} from "@heroui/react";

type Props = {
  groupId: number;
};

export const PointsButton = ({ groupId }: Props) => {
  const t = useTranslations();
  const router = useRouter();
  const { data } = useGroupPointsByGroupId(groupId);
  const { onOpenChange, isOpen, onOpen } = useDisclosure();
  const handleScan = (values: IDetectedBarcode[]) => {
    const value = values[0];
    router.push(value.rawValue);
  };

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button className="min-w-min px-3" variant="light">
            <Coins className="text-yellow-400 w-5 h-5" />{" "}
            {data?.data?.groupPoints?.points ?? "?"}
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          <DropdownItem key="qrCode" onPress={onOpen}>
            <div className="flex items-center gap-2">
              <ScanQrCode className="text-primary" /> {t("scanCode")}
            </div>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>{t("scanCode")}</ModalHeader>
          <ModalFooter>
            <Scanner onScan={handleScan} allowMultiple={false} />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
