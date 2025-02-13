import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { BackIconButton } from "../icon-buttons/back-icon-button";

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
    <div className="flex flex-col gap-2 w-full items-start p-8 pb-0">
      <div className="flex w-full gap-2 items-center justify-between">
        <div className="flex items-center justify-start">
          {leading
            ? leading
            : hrefBackButton && (
                <Link href={hrefBackButton}>
                  <BackIconButton />
                </Link>
              )}
        </div>
        <div className="flex items-center">{trailing}</div>
      </div>
      <h1 className="header-3">{children}</h1>
    </div>
  );
};
