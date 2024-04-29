"use client";

import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "./ui/button";
import { Separator } from "./ui/separator";
import { ChevronRight } from "lucide-react";

type Props = {
  withSeparator?: boolean;
  isClickable?: boolean;
} & ButtonProps;

export const ListTile = ({
  children,
  className,
  withSeparator = true,
  isClickable = true,
  ...rest
}: Props) => {
  return (
    <>
      <Button
        {...rest}
        className={cn(
          "justify-between px-0 h-auto py-3 font-normal",
          className
        )}
        variant="ghost"
      >
        {children}
        {isClickable ? (
          <ChevronRight className="text-gray-400" size={16} />
        ) : null}
      </Button>
      {withSeparator && <Separator />}
    </>
  );
};
