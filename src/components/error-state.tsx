"use client";

import { Alert, Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import { useTranslations } from "next-intl";

type Props = {
  error: string;
  controls?: React.ReactNode;
};

export function ErrorState({ error, controls }: Props) {
  const t = useTranslations();

  return (
    <div className="w-full flex items-center justify-center flex-grow">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-2xl">{t("somethingWentWrong")}</h2>
        </CardHeader>
        <CardBody>
          <Alert color="danger" title={error} />
        </CardBody>
        <CardFooter>
          <div className="flex flex-col gap-2">
            {controls}
            <p className="text-sm text-zinc-400">{t("contactSupport")}</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
