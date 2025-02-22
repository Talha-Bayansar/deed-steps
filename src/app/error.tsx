"use client";

import { ErrorState } from "@/components/error-state";
import { Main } from "@/components/layout/main";
import { Navbar } from "@/components/layout/navbar";
import { PageContainer } from "@/components/layout/page-container";
import { View } from "@/components/layout/view";
import { refreshCache } from "@/lib/actions";
import { routes } from "@/lib/routes";
import { Button } from "@heroui/button";
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
        <View className="justify-center flex-grow">
          <View>
            <ErrorState
              error={error.message}
              controls={
                <div className="flex gap-2 flex-wrap">
                  <Button color="primary" onPress={handleRefresh}>
                    {t("tryAgain")}
                  </Button>
                  <Button as={Link} href={routes.landingPage.root}>
                    {t("goToLandingPage")}
                  </Button>
                </div>
              }
            />
            {error.digest && <p>{error.digest}</p>}
          </View>
        </View>
      </Main>
    </PageContainer>
  );
}
