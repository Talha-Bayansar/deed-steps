import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  Icon: LucideIcon;
};

export const IconButton = ({ className, Icon, ...props }: Props) => {
  return (
    <button
      className={cn(
        "text-primary flex items-center hover:bg-muted active:bg-muted rounded-full p-1",
        className
      )}
      {...props}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
};
