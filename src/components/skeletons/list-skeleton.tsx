import { View } from "../layout/view";
import { Skeleton } from "../ui/skeleton";
import { generateArray } from "@/lib/utils";

type Props = {
  size?: number;
};

export const ListSkeleton = ({ size }: Props) => {
  return (
    <View>
      {generateArray(size).map((i) => (
        <Skeleton key={`priceItem_${i}`} className="w-full h-20" />
      ))}
    </View>
  );
};
