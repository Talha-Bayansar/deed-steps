import { cn } from "@/lib/utils";

type Props = React.HTMLAttributes<HTMLElement>;

export const Heading = ({ className, children, ...rest }: Props) => {
  return (
    <div
      className={cn("mb-8 flex justify-between items-center", className)}
      {...rest}
    >
      {children}
    </div>
  );
};
