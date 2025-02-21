"use client";

import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Skeleton,
} from "@heroui/react";
import { View } from "../layout/view";

export const CardSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-full rounded-medium" />
      </CardHeader>
      <CardBody>
        <View className="gap-2">
          <Skeleton className="h-4 w-full rounded-medium" />
          <Skeleton className="h-4 w-32 rounded-medium" />
        </View>
      </CardBody>
      <CardFooter>
        <Skeleton className="h-10 w-24 rounded-medium" />
      </CardFooter>
    </Card>
  );
};
