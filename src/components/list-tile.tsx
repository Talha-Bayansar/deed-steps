"use client";

import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@heroui/button";
import { ChevronRight } from "lucide-react";

type Props = {
  hideChevron?: boolean;
} & ButtonProps;

export const ListTile = ({
  children,
  className,
  hideChevron = false,
  ...rest
}: Props) => {
  return (
    <Button
      className={cn("flex w-full justify-between items-center", className)}
      variant="faded"
      {...rest}
    >
      <div className="flex gap-2 items-center w-full">{children}</div>
      {!hideChevron ? <ChevronRight size={16} /> : null}
    </Button>
  );
};
