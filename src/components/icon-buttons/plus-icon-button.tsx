"use client";

import { IconButton } from ".";
import { Plus } from "lucide-react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const AddIconButton = (props: Props) => {
  return <IconButton Icon={Plus} {...props} />;
};
