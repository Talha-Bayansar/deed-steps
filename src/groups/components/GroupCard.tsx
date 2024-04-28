"use client";

import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import type { Group } from "../models";

type Props = {
  group: Group;
  userCount: number;
};

export const GroupCard = ({ group, userCount }: Props) => {
  return (
    <Card className="p-4">
      <div className="flex flex-col gap-2">
        <CardTitle>{group.name}</CardTitle>
        <CardDescription>Members: {userCount}</CardDescription>
      </div>
    </Card>
  );
};
