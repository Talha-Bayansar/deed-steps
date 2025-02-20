"use client";

import { ButtonProps } from "@heroui/button";
import { IconButton } from ".";
import { ArrowLeft } from "lucide-react";

type Props = ButtonProps;

export const BackIconButton = (props: Props) => {
  return <IconButton Icon={ArrowLeft} {...props} />;
};
