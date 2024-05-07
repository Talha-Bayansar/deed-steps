"use client";

import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "./ui/button";
import { Separator } from "./ui/separator";
import { ChevronRight } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

type Props = {
  withSeparator?: boolean;
  isClickable?: boolean;
} & ButtonProps;

export const ListTile = ({
  children,
  className,
  onClick,
  withSeparator = true,
  isClickable = true,
  ...rest
}: Props) => {
  return (
    <div className="flex flex-col">
      <Button
        {...rest}
        className={cn("px-0 h-auto py-3 font-normal", className, {
          "hover:bg-transparent cursor-default": !isClickable,
        })}
        onClick={!isClickable ? (e) => e.preventDefault() : onClick}
        variant="ghost"
      >
        <div className="flex w-full justify-between items-center">
          <div className="flex items-center">{children}</div>
          {isClickable ? (
            <ChevronRight className="text-gray-400" size={16} />
          ) : null}
        </div>
      </Button>
      {withSeparator && <Separator />}
    </div>
  );
};

export const ListTileSkeleton = () => (
  <div className="flex flex-col">
    <Button
      className="justify-between px-0 h-auto py-3 font-normal"
      variant="ghost"
    >
      <Skeleton className="h-5 w-28" />
    </Button>
    <Separator />
  </div>
);
