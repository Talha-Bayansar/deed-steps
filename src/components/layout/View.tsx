import { cn } from "@/lib/utils";

type Props = React.HTMLAttributes<HTMLDivElement>;

export const View = ({ className, children, ...rest }: Props) => {
  return (
    <div className={cn("flex flex-col gap-4", className)} {...rest}>
      {children}
    </div>
  );
};
