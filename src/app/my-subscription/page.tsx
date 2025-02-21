import { ErrorState } from "@/components/error-state";
import { View } from "@/components/layout/view";
import { monthPrices } from "@/features/stripe";
import { getUserPlan } from "@/features/stripe/api";
import { SubscriptionCard } from "@/features/stripe/components/subscription-card";
import { extractError } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { Controls } from "./_components/controls";

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
      <SubscriptionCard
        subData={subData}
        paymentInterval={paymentInterval}
        plan={plan.data!.plan}
      />
      <Controls />
    </View>
  );
};

export default MySubscriptionPage;
