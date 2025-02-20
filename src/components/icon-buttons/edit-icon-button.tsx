"use client";

import { ButtonProps } from "@heroui/button";
import { IconButton } from ".";
import { Edit } from "lucide-react";

type Props = ButtonProps;

export const EditIconButton = (props: Props) => {
  return <IconButton Icon={Edit} {...props} />;
};
