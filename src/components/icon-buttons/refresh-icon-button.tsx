"use client";

import { ButtonProps } from "@heroui/button";
import { IconButton } from ".";
import { RefreshCw } from "lucide-react";

type Props = ButtonProps;

export const RefreshIconButton = (props: Props) => {
  return <IconButton Icon={RefreshCw} {...props} />;
};
