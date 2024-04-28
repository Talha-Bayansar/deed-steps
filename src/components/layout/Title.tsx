import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  children?: React.ReactNode;
};

export const Title = ({ className, children }: Props) => {
  return (
    <h1 className={cn("mb-8 text-4xl font-semibold", className)}>{children}</h1>
  );
};
