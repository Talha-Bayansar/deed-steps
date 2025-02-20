"use client";

import { Skeleton } from "@heroui/react";
import { View } from "../layout/view";
import { generateArray } from "@/lib/utils";

type Props = {
  size?: number;
};

export const ListSkeleton = ({ size }: Props) => {
  return (
    <View>
      {generateArray(size).map((i) => (
        <Skeleton key={`priceItem_${i}`} className="w-full h-20 rounded" />
      ))}
    </View>
  );
};
