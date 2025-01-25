import { cn } from "@/lib/utils";

type Props = {
  submitButton?: React.ReactNode;
} & React.FormHTMLAttributes<HTMLFormElement>;

export const AppForm = ({
  children,
  className,
  submitButton,
  ...rest
}: Props) => {
  return (
    <form
      className={cn(
        "flex flex-col flex-grow w-full justify-between md:justify-start gap-8 overflow-hidden p-1",
        className
      )}
      {...rest}
    >
      <div className="flex flex-col gap-8">{children}</div>
      {submitButton}
    </form>
  );
};
