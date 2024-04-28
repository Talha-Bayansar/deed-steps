import React from "react";
import { View } from "./layout/View";
import type { LucideIcon } from "lucide-react";

type Props = {
  Icon: LucideIcon;
  message: string;
  actionComponent?: React.ReactNode;
};

export const EmptyView = ({ Icon, message, actionComponent }: Props) => {
  return (
    <View className="grid place-items-center flex-grow">
      <View className="items-center">
        <Icon className="text-primary" size={60} />
        <p className="text-center">{message}</p>
        {actionComponent}
      </View>
    </View>
  );
};
