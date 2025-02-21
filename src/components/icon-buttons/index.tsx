import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@heroui/button";
import type { LucideIcon } from "lucide-react";

type Props = ButtonProps & {
  Icon: LucideIcon;
};

export const IconButton = ({
  className,
  Icon,
  color = "primary",
  ...props
}: Props) => {
  return (
    <Button
      {...props}
      className={cn(className)}
      isIconOnly
      color={color}
      variant="light"
    >
      <Icon className="w-5 h-5" />
    </Button>
  );
};
