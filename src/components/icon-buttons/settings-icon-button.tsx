"use client";

import { IconButton } from ".";
import { Settings } from "lucide-react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const SettingsIconButton = (props: Props) => {
  return <IconButton Icon={Settings} {...props} />;
};
