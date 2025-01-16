"use client";

import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

type Props = {
  hideChevron?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export const ListTile = ({
  children,
  className,
  hideChevron = false,
  ...rest
}: Props) => {
  return (
    <div
      className={cn("flex w-full justify-between items-center", className)}
      {...rest}
    >
      <div className="flex gap-2 items-center w-full">{children}</div>
      {!hideChevron ? (
        <ChevronRight className="text-muted-foreground" size={16} />
      ) : null}
    </div>
  );
};
