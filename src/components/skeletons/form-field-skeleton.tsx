"use client";

import { View } from "../layout/view";
import { Skeleton } from "@heroui/react";

export const FormFieldSkeleton = () => {
  return (
    <View className="gap-2">
      <Skeleton className="w-16 h-4 rounded-medium" />
      <Skeleton className="w-full h-10 rounded-medium" />
    </View>
  );
};
