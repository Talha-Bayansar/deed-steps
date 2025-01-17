import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type Props = {
  leading?: React.ReactNode;
  hrefBackButton?: string;
  children: React.ReactNode;
  trailing?: React.ReactNode;
};

export const Navbar = ({
  hrefBackButton,
  children,
  trailing,
  leading,
}: Props) => {
  return (
    <div className="flex w-full gap-2 p-8 pb-2 items-center">
      <div className="flex-1 flex items-center justify-start">
        {leading
          ? leading
          : hrefBackButton && (
              <Link href={hrefBackButton}>
                <ArrowLeft className="text-primary" />
              </Link>
            )}
      </div>
      <h1 className="header-3 flex-grow text-center">{children}</h1>
      <div className="flex-1 flex items-center justify-end">{trailing}</div>
    </div>
  );
};
