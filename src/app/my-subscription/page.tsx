import { ErrorState } from "@/components/error-state";
import { View } from "@/components/layout/view";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserPlan } from "@/features/stripe/api";
import { extractError } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

const MySubscriptionPage = async () => {
  const plan = await getUserPlan();
  const t = await getTranslations();

  const error = extractError(plan, t);
  if (error) return <ErrorState error={error} />;

  return (
    <View className="flex-grow justify-center items-center">
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
                  {plan.data!.subData?.status === "active"
                    ? t("billedMonthly")
                    : plan.data!.subData?.status === "trialing"
                    ? t("trialPeriod")
                    : t("noActiveSubscription")}
                </p>
              </div>
              {/* <ManageSubscriptionButton /> */}
            </div>
          </div>
        </CardContent>
      </Card>
    </View>
  );
};

export default MySubscriptionPage;
