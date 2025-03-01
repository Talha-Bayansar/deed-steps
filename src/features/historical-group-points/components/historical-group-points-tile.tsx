"use client";

import { ListTile } from "@/components/list-tile";
import { HistoricalGroupPoints } from "../types";
import { ComponentProps } from "react";
import { User } from "@/features/auth/types";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

type Props = {
  historicalPoints: {
    historical_group_points: HistoricalGroupPoints;
    user: User;
  };
} & ComponentProps<typeof ListTile>;

export const HistoricalGroupPointsTile = ({
  historicalPoints,
  className,
  ...props
}: Props) => {
  return (
    <ListTile className={cn("h-auto p-3", className)} {...props}>
      <div className="flex items-center justify-between w-full">
        <span className="text-xl font-medium">
          {historicalPoints.user.firstName}
        </span>
        <span className="flex items-center gap-1 text-lg">
          <Star className="text-yellow-400" />
          {historicalPoints.historical_group_points.finalPoints}
        </span>
      </div>
    </ListTile>
  );
};
