"use client";

import { routes } from "@/lib/routes";
import { Button } from "@heroui/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";

type Props = {};

export const Controls = (props: Props) => {
  const t = useTranslations();
  return (
    <div className="flex flex-col gap-4 sm:flex-row w-full">
      <Button color="primary" as={Link} href={routes.app}>
        {t("goToApp")}
      </Button>
      <Button as={Link} href={routes.landingPage.root}>
        {t("goToLandingPage")}
      </Button>
    </div>
  );
};
