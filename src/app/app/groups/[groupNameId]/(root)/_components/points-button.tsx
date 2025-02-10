"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useGroupPointsByGroupId } from "@/features/group-points/hooks/use-group-points-by-group-id";
import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import { Coins, ScanQrCode } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

type Props = {
  groupId: number;
};

export const PointsButton = ({ groupId }: Props) => {
  const t = useTranslations();
  const router = useRouter();
  const { data } = useGroupPointsByGroupId(groupId);
  const handleScan = (values: IDetectedBarcode[]) => {
    const value = values[0];
    router.push(value.rawValue);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex items-center gap-2 bg-gray-50 rounded p-1">
          <Coins className="text-yellow-400 w-5 h-5" />{" "}
          {data?.data?.groupPoints?.points ?? "?"}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Dialog>
          <DialogTrigger>
            <DropdownMenuLabel className="text-primary flex items-center gap-2">
              <ScanQrCode className="h-4 w-4" /> {t("scanCode")}
            </DropdownMenuLabel>
          </DialogTrigger>
          <DialogContent>
            <Scanner onScan={handleScan} allowMultiple={false} />
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
