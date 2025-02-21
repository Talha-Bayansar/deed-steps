"use client";

import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import { ManageSubscriptionButton } from "./manage-subscription-button";
import { useTranslations } from "next-intl";
import { STRIPE_SUB_CACHE, StripePlan } from "../types";

type Props = {
  subData: STRIPE_SUB_CACHE | null;
  paymentInterval: "monthly" | "yearly" | "none";
  plan: StripePlan;
};

export const SubscriptionCard = ({ subData, paymentInterval, plan }: Props) => {
  const t = useTranslations();
  return (
    <Card className="w-full">
      <CardHeader>
        <h2 className="text-xl font-medium">{t("mySubscription")}</h2>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="mb-4 sm:mb-0">
              <p className="font-medium capitalize">
                {t("currentPlan")}: {t(plan)}
              </p>
              <p className="text-sm text-muted-foreground">
                {subData?.status === "active"
                  ? paymentInterval === "monthly"
                    ? t("billedMonthly")
                    : t("billedYearly")
                  : subData?.status === "trialing"
                  ? t("trialPeriod")
                  : t("noActiveSubscription")}
              </p>
            </div>

            <ManageSubscriptionButton />
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
