import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

type Props = {
  className?: string;
  children?: React.ReactNode;
};

export const Title = ({ className, children }: Props) => {
  return (
    <h1 className={cn("text-3xl md:text-4xl font-semibold", className)}>
      {children}
    </h1>
  );
};

export const TitleSkeleton = () => {
  return <Skeleton className="h-10 w-full" />;
};
