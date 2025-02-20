"use client";

import Link from "next/link";
import { BackIconButton } from "../icon-buttons/back-icon-button";
import { Card, CardFooter, CardHeader } from "@heroui/react";

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
    <Card className="rounded-t-none">
      <CardHeader>
        {(leading || hrefBackButton || trailing) && (
          <div className="flex w-full gap-2 items-center justify-between">
            <div className="flex items-center justify-start">
              {leading
                ? leading
                : hrefBackButton && (
                    <BackIconButton as={Link} href={hrefBackButton} />
                  )}
            </div>
            <div className="flex items-center">{trailing}</div>
          </div>
        )}
      </CardHeader>

      <CardFooter>
        <h1 className="text-2xl font-semibold">{children}</h1>
      </CardFooter>
    </Card>
  );
};
