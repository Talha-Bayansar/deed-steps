"use client";

import { ErrorState } from "@/components/error-state";
import { Main } from "@/components/layout/main";
import { Navbar } from "@/components/layout/navbar";
import { PageContainer } from "@/components/layout/page-container";
import { View } from "@/components/layout/view";
import { Button } from "@heroui/button";
import { useTranslations } from "next-intl";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations();

  const handleRefresh = async () => {
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
                <Button color="primary" onPress={handleRefresh}>
                  {t("tryAgain")}
                </Button>
              }
            />
            {error.digest && <p>{error.digest}</p>}
          </View>
        </View>
      </Main>
    </PageContainer>
  );
}
