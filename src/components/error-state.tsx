"use client";

import { AlertCircle, XCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "./ui/card";
import { useTranslations } from "next-intl";

interface ErrorHandlerProps {
  error: string;
  reset?: () => void;
}

export function ErrorMessage({ error, reset }: ErrorHandlerProps) {
  const t = useTranslations();

  return (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="mb-2">{t("error")}</AlertTitle>
      <AlertDescription className="flex flex-col gap-4">
        <p>{error}</p>
        {reset && (
          <Button
            variant="outline"
            size="sm"
            onClick={reset}
            className="self-start"
          >
            {t("tryAgain")}
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}

export function ErrorState({ error }: { error: string }) {
  const t = useTranslations();

  return (
    <div className="w-full flex items-center justify-center flex-grow">
      <Card className="w-full max-w-md p-6">
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
          <XCircle className="w-6 h-6 text-red-600" />
        </div>
        <h2 className="mb-4 text-2xl font-bold text-center text-gray-900">
          {t("somethingWentWrong")}
        </h2>
        <ErrorMessage error={error} />
        <p className="mt-4 text-sm text-center text-gray-600">
          {t("contactSupport")}
        </p>
      </Card>
    </div>
  );
}
