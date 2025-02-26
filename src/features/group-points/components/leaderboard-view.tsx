"use client";

import { User } from "@/features/auth/types";
import { GroupPoints } from "../types";
import { View } from "@/components/layout/view";
import { ListTile } from "@/components/list-tile";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

type Props = {
  groupPoints: GroupPoints[];
  currentUser: User;
};

export const LeaderboardView = ({ groupPoints, currentUser }: Props) => {
  const sortedPoints = groupPoints.sort(
    (a, b) => Number(b.totalPoints) - Number(a.totalPoints)
  );
  const currentUserIndex = sortedPoints.findIndex(
    (points) => points.userId === currentUser.id
  );

  const displayPoints = sortedPoints.filter((points, index) => {
    if (index === currentUserIndex) return true;
    if (index === currentUserIndex - 1) return true;
    if (index === currentUserIndex + 1) return true;
    return false;
  });

  return (
    <View className="flex-grow">
      {displayPoints.map((points) => {
        const isCurrentUser = points.userId === currentUser.id;
        const rank =
          sortedPoints.findIndex((p) => p.userId === points.userId) + 1;
        return (
          <ListTile
            key={points.userId}
            className={cn("flex-grow h-full")}
            hideChevron
            disableAnimation
            disableRipple
            as="div"
          >
            <div className="flex justify-between items-center gap-4 w-full">
              <div
                className={cn("font-bold text-5xl", {
                  "text-primary": isCurrentUser,
                })}
              >
                #{rank}
              </div>
              <div className="flex items-center gap-2 text-3xl">
                <Star className="text-yellow-400" size={32} />{" "}
                {points.totalPoints}
              </div>
            </div>
          </ListTile>
        );
      })}
    </View>
  );
};
