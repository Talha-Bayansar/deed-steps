import { ErrorState } from "@/components/error-state";
import { View } from "@/components/layout/view";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { monthPrices } from "@/features/stripe";
import { getUserPlan } from "@/features/stripe/api";
import { ManageSubscriptionButton } from "@/features/stripe/components/manage-subscription-button";
import { routes } from "@/lib/routes";
import { extractError } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

const MySubscriptionPage = async () => {
  const plan = await getUserPlan();
  const t = await getTranslations();

  const error = extractError(plan, t);
  if (error) return <ErrorState error={error} />;

  const subData = plan.data!.subData;

  const paymentInterval =
    subData?.status === "active"
      ? monthPrices.includes(subData.priceId ?? "")
        ? "monthly"
        : "yearly"
      : "none";

  return (
    <View className="flex-grow items-center">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{t("mySubscription")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="mb-4 sm:mb-0">
                <p className="font-medium capitalize">
                  {t("currentPlan")}: {t(plan.data!.plan)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {subData?.status === "active"
                    ? paymentInterval === "monthly"
                      ? t("billedMonthly")
                      : t("billedYearly")
                    : plan.data!.subData?.status === "trialing"
                    ? t("trialPeriod")
                    : t("noActiveSubscription")}
                </p>
              </div>

              <ManageSubscriptionButton />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-col gap-4 sm:flex-row w-full">
        <Link className={buttonVariants()} href={routes.app}>
          {t("goToApp")}
        </Link>
        <Link
          className={buttonVariants({
            variant: "outline",
          })}
          href={routes.landingPage.root}
        >
          {t("goToLandingPage")}
        </Link>
      </div>
    </View>
  );
};

export default MySubscriptionPage;
