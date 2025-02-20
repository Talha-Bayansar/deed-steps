"use client";

import { ButtonProps } from "@heroui/button";
import { IconButton } from ".";
import { Plus } from "lucide-react";

type Props = ButtonProps;

export const AddIconButton = (props: Props) => {
  return <IconButton Icon={Plus} {...props} />;
};
