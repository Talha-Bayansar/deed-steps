import { cn } from "@/lib/utils";

type Props = React.HTMLAttributes<HTMLDivElement>;

export const View = ({ children, className, ...rest }: Props) => {
  return (
    <div className={cn("flex flex-col gap-4 w-full", className)} {...rest}>
      {children}
    </div>
  );
};
