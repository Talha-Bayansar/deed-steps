"use client";

import { ErrorState } from "@/components/error-state";
import { Main } from "@/components/layout/main";
import { Navbar } from "@/components/layout/navbar";
import { PageContainer } from "@/components/layout/page-container";
import { View } from "@/components/layout/view";
import { RevalidateButton } from "@/components/revalidate-button";
import { Button, buttonVariants } from "@/components/ui/button";
import { deedStatusesKey } from "@/features/deed-status/queries";
import { deedTemplatesKey } from "@/features/deed-template/queries";
import { groupPointsKey } from "@/features/group-points/queries";
import { groupsKey } from "@/features/group/queries";
import { invitationsKey } from "@/features/invitation/queries";
import { pushSubscriptionsKey } from "@/features/notification/queries";
import { userToGroupKey } from "@/features/user-to-group/queries";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations();

  return (
    <PageContainer>
      <Navbar
        trailing={
          <RevalidateButton
            tags={[
              groupsKey,
              pushSubscriptionsKey,
              deedTemplatesKey,
              userToGroupKey,
              deedStatusesKey,
              groupPointsKey,
              invitationsKey,
            ]}
          />
        }
      >
        {t("error")}
      </Navbar>
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
            <Button className="w-full" onClick={() => reset()}>
              {t("tryAgain")}
            </Button>
          </div>
        </View>
      </Main>
    </PageContainer>
  );
}
