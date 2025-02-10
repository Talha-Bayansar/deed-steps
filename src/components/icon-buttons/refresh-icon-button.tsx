"use client";

import { IconButton } from ".";
import { RefreshCw } from "lucide-react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const RefreshIconButton = (props: Props) => {
  return <IconButton Icon={RefreshCw} {...props} />;
};
