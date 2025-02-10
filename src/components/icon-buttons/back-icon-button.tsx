"use client";

import { IconButton } from ".";
import { ArrowLeft } from "lucide-react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const BackIconButton = (props: Props) => {
  return <IconButton Icon={ArrowLeft} {...props} />;
};
