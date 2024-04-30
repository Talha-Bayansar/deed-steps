import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  children?: React.ReactNode;
};

export const Main = ({ className, children }: Props) => {
  return (
    <main className={cn("flex w-full max-w-3xl flex-grow flex-col", className)}>
      {children}
    </main>
  );
};
