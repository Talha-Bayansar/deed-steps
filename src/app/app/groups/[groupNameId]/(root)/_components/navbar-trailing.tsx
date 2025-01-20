"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useGroupPointsByGroupId } from "@/features/group/hooks/use-group-points-by-group-id";
import { routes } from "@/lib/routes";
import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import { Camera, Coins, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  groupName: string;
  groupId: string;
};

export const NavbarTrailing = ({ groupId, groupName }: Props) => {
  const router = useRouter();
  const { data } = useGroupPointsByGroupId(Number(groupId));
  const handleScan = (values: IDetectedBarcode[]) => {
    const value = values[0];
    router.push(value.rawValue);
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 bg-gray-50 rounded p-2">
        <Coins className="text-yellow-400" />{" "}
        {data?.data?.groupPoints.points ?? "?"}
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <button>
            <Camera className="text-primary" />
          </button>
        </DialogTrigger>
        <DialogContent>
          <Scanner onScan={handleScan} allowMultiple={false} />
        </DialogContent>
      </Dialog>
      {data?.data?.isOwner && (
        <Link
          className="text-primary"
          href={routes.groups.nameId(groupName, groupId).settings.root}
        >
          <Settings />
        </Link>
      )}
    </div>
  );
};
