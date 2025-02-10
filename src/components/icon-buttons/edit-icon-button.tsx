"use client";

import { IconButton } from ".";
import { Edit } from "lucide-react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const EditIconButton = (props: Props) => {
  return <IconButton Icon={Edit} {...props} />;
};
