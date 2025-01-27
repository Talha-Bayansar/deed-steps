import { View } from "@/components/layout/view";
import { DeedStatus } from "../types";
import { UpdateDeedStatusTile } from "./update-deed-status-tile";

type Props = {
  deedStatuses: DeedStatus[];
};

export const UpdateDeedStatusTileView = ({ deedStatuses }: Props) => {
  return (
    <View className="gap-0">
      {deedStatuses
        .sort((a, b) => Number(a.reward) - Number(b.reward))
        .map((status) => (
          <UpdateDeedStatusTile key={status.id} status={status} />
        ))}
    </View>
  );
};
