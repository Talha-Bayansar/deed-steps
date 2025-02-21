import { cn } from "@/lib/utils";

type Props = React.HTMLAttributes<HTMLElement>;

export const Main = ({ children, className, ...rest }: Props) => {
  return (
    <main
      className={cn(
        "flex flex-col flex-grow w-full p-4 md:items-start",
        className
      )}
      {...rest}
    >
      {children}
    </main>
  );
};
