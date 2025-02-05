"use client";

import { ErrorState } from "@/components/error-state";
import { Main } from "@/components/layout/main";
import { Navbar } from "@/components/layout/navbar";
import { PageContainer } from "@/components/layout/page-container";
import { View } from "@/components/layout/view";
import { Button, buttonVariants } from "@/components/ui/button";
import { refreshCache } from "@/lib/actions";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations();
  const { execute } = useAction(refreshCache);

  const handleRefresh = async () => {
    execute();
    reset();
  };

  return (
    <PageContainer>
      <Navbar>{t("error")}</Navbar>
      <Main>
        <View className="justify-between flex-grow">
          <View>
            <ErrorState error={error.message} />
            {error.digest && <p>{error.digest}</p>}
          </View>

          <div className="flex flex-col gap-4">
            <Link
              className={cn(
                buttonVariants({
                  variant: "outline",
                }),
                "w-full"
              )}
              href={routes.landingPage.root}
            >
              {t("goToLandingPage")}
            </Link>
            <Button className="w-full" onClick={handleRefresh}>
              {t("tryAgain")}
            </Button>
          </div>
        </View>
      </Main>
    </PageContainer>
  );
}
