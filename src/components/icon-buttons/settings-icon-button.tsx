"use client";

import { IconButton } from ".";
import { Settings } from "lucide-react";
import { ButtonProps } from "@heroui/button";

type Props = ButtonProps;

export const SettingsIconButton = (props: Props) => {
  return <IconButton Icon={Settings} {...props} />;
};
